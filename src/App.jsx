import React, { useState, useEffect } from 'react';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './pages/LandingPage';
import MissionControl from './pages/MissionControl';
import RadiationMonitor from './pages/RadiationMonitor';
import EventLog from './pages/EventLog';
import DailyReportView from './pages/DailyReportView';
import MissionResults from './pages/MissionResults';
import ManualModal from './components/modals/ManualModal';
import DailyReportModal from './components/modals/DailyReportModal';
import EventModal from './components/modals/EventModal';
import { 
  loadGameState, 
  saveGameState, 
  clearSavedGameState, 
  createInitialGameState 
} from './game/gameState';
import { simulateSolTick } from './game/resourceEngine';
import { checkForSolEvents } from './game/eventEngine';
import { resolveEventDecision } from './game/decisionEngine';
import { checkFailureConditions, evaluateFinalMissionScore } from './game/missionEngine';
import { soundService } from './services/soundService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('loading_boot');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [latestReport, setLatestReport] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);
  const [missionResult, setMissionResult] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize Audio & Game State
  useEffect(() => {
    soundService.initMuteState();
    setIsMuted(soundService.isMuted());
  }, []);

  const [gameState, setGameState] = useState(() => loadGameState());

  // Save state to localStorage whenever gameState changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Check failure states on load or update
  useEffect(() => {
    if (gameState.missionStatus === 'in_progress') {
      const failure = checkFailureConditions(gameState);
      if (failure) {
        soundService.playAlert();
        setMissionResult(failure);
        setCurrentPage('results');
      } else if (gameState.currentSol > gameState.totalSols) {
        const finalScore = evaluateFinalMissionScore(gameState);
        if (finalScore.status === 'victory') {
          soundService.playVictory();
        }
        setMissionResult(finalScore);
        setCurrentPage('results');
      }
    }
  }, [gameState]);

  // Toggle Mute Audio
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundService.setMuted(nextMuted);
    if (!nextMuted) soundService.playClick();
  };

  // Start Mission from landing screen (loads 3D terrain sequence)
  const handleStartMission = () => {
    soundService.playClick();
    setCurrentPage('loading_outpost');
  };

  // Start New Mission from landing screen (clears save, resets to Sol 1)
  const handleStartNewMission = () => {
    soundService.playClick();
    clearSavedGameState();
    const fresh = createInitialGameState();
    setGameState(fresh);
    setMissionResult(null);
    setLatestReport(null);
    setIsReportOpen(false);
    setActiveEvent(null);
    setCurrentPage('loading_outpost');
  };

  // Switch navigation tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Toggle crew shelter lockdown protocol
  const handleToggleShelter = () => {
    soundService.playClick();
    setGameState(prev => {
      const currentShelter = prev.resources.radiation.crewInShelter;
      return {
        ...prev,
        resources: {
          ...prev.resources,
          radiation: {
            ...prev.resources.radiation,
            crewInShelter: !currentShelter,
          }
        }
      };
    });
  };

  // Repair a module using spare parts
  const handleRepairModule = (moduleId) => {
    soundService.playClick();
    setGameState(prev => {
      const parts = prev.resources.spareParts.current;
      if (parts < 1) return prev;

      const currentHealth = prev.moduleHealth[moduleId] || 100;
      const newHealth = Math.min(100, currentHealth + 20);

      return {
        ...prev,
        resources: {
          ...prev.resources,
          spareParts: {
            ...prev.resources.spareParts,
            current: parts - 1,
          }
        },
        moduleHealth: {
          ...prev.moduleHealth,
          [moduleId]: newHealth,
        }
      };
    });
  };

  // Advance Sol (Turn progression tick)
  const handleAdvanceSol = () => {
    if (gameState.currentSol > gameState.totalSols) return;

    soundService.playAdvanceSol();

    // Run the decoupled resource simulation engine for 1 Sol
    const { nextState, dailyReport } = simulateSolTick(gameState);

    // Check for failure immediately after Sol tick
    const failure = checkFailureConditions(nextState);
    if (failure) {
      soundService.playAlert();
      setGameState(nextState);
      setMissionResult(failure);
      setCurrentPage('results');
      return;
    }

    // Check if 30-Sol mission is complete
    if (nextState.currentSol > nextState.totalSols) {
      const finalResult = evaluateFinalMissionScore(nextState);
      if (finalResult.status === 'victory') soundService.playVictory();
      setGameState(nextState);
      setMissionResult(finalResult);
      setCurrentPage('results');
      return;
    }

    // Check if a survival event triggers on this Sol
    const emergentEvent = checkForSolEvents(nextState);
    if (emergentEvent) {
      soundService.playAlert();
      if (!nextState.pendingDecisions) nextState.pendingDecisions = [];
      nextState.pendingDecisions.push(emergentEvent);
      setActiveEvent(emergentEvent);
    }

    // Update state and show Daily Report debrief
    setGameState(nextState);
    setLatestReport(dailyReport);
    setIsReportOpen(true);
  };

  // Handle player choice for an event
  const handleSelectEventChoice = (choiceId) => {
    if (!activeEvent) return;
    soundService.playClick();

    const { nextState, resolutionMessage } = resolveEventDecision(gameState, activeEvent.id, choiceId);
    setGameState(nextState);
    setActiveEvent(null);

    // Re-check failure conditions after choice consequences
    const failure = checkFailureConditions(nextState);
    if (failure) {
      soundService.playAlert();
      setMissionResult(failure);
      setCurrentPage('results');
    }
  };

  // Restart Mission (Full Reset)
  const handleRestartMission = () => {
    soundService.playClick();
    clearSavedGameState();
    const fresh = createInitialGameState();
    setGameState(fresh);
    setMissionResult(null);
    setLatestReport(null);
    setIsReportOpen(false);
    setActiveEvent(null);
    setCurrentPage('landing');
  };

  // 1. Initial NASA Telemetry Boot Sequence
  if (currentPage === 'loading_boot') {
    return (
      <LoadingScreen
        mode="boot"
        minimumDuration={1900}
        onComplete={() => setCurrentPage('landing')}
      />
    );
  }

  // 2. Mission Setup & Continue Screen
  if (currentPage === 'landing') {
    return (
      <LandingPage
        gameState={gameState}
        onStartMission={handleStartMission}
        onStartNewMission={handleStartNewMission}
      />
    );
  }

  // 3. Loading 3D Chryse Sector Terrain & Scene
  if (currentPage === 'loading_outpost') {
    return (
      <LoadingScreen
        mode="outpost"
        minimumDuration={1800}
        onComplete={() => {
          setCurrentPage('app');
          setActiveTab('dashboard');
        }}
      />
    );
  }

  // 4. If mission ended (Victory, Partial, Failure), show MissionResults
  if (currentPage === 'results' && missionResult) {
    return (
      <MissionResults
        missionResult={missionResult}
        gameState={gameState}
        onRestart={handleRestartMission}
      />
    );
  }

  // Active view switcher based on activeTab
  const renderActiveView = () => {
    const commonProps = {
      gameState,
      onTabChange: handleTabChange,
      activeTab,
      onOpenIntro: () => setIsManualOpen(true),
      isMuted,
      onToggleMute: handleToggleMute,
    };

    switch (activeTab) {
      case 'dashboard':
        return (
          <MissionControl
            {...commonProps}
            setGameState={setGameState}
            onAdvanceSol={handleAdvanceSol}
            onRepairModule={handleRepairModule}
            onRestartMission={handleRestartMission}
          />
        );
      case 'radiation':
        return (
          <RadiationMonitor
            {...commonProps}
            onToggleShelter={handleToggleShelter}
          />
        );
      case 'events':
        return (
          <EventLog
            {...commonProps}
            onOpenEventModal={(evt) => {
              soundService.playClick();
              setActiveEvent(evt);
            }}
          />
        );
      case 'report':
        return (
          <DailyReportView
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderActiveView()}

      {/* Daily Report Debrief Modal */}
      <DailyReportModal
        report={latestReport}
        isOpen={isReportOpen}
        onClose={() => {
          soundService.playClick();
          setIsReportOpen(false);
        }}
        nextSol={gameState.currentSol}
      />

      {/* Core Emergency Event Modal */}
      <EventModal
        event={activeEvent}
        isOpen={Boolean(activeEvent)}
        onSelectChoice={handleSelectEventChoice}
        gameState={gameState}
      />

      {/* Manual / Operations Guide Modal */}
      <ManualModal
        isOpen={isManualOpen}
        onClose={() => {
          soundService.playClick();
          setIsManualOpen(false);
        }}
      />
    </>
  );
}
