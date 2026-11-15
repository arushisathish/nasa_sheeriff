import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import OutpostCanvas from '../scene/OutpostCanvas';
import FirstPersonHUD from '../components/hud/FirstPersonHUD';
import VisorScannerOverlay from '../components/hud/VisorScannerOverlay';
import AirlockCycleOverlay from '../components/hud/AirlockCycleOverlay';
import CommandConsoleModal from '../components/modals/CommandConsoleModal';
import WorkbenchModal from '../components/modals/WorkbenchModal';
import PauseMenuModal from '../components/modals/PauseMenuModal';
import RoomDetailsPanel from '../components/hud/RoomDetailsPanel';
import { MODULE_IDS } from '../data/modulesConfig';
import { soundService } from '../services/soundService';

export default function MissionControl({
  gameState,
  onAdvanceSol,
  onRepairModule,
  onTabChange,
  activeTab,
  onOpenIntro,
  onRestartMission,
  setGameState,
}) {
  const canvasRef = useRef(null);
  const [nearbyStation, setNearbyStation] = useState(null);
  const [activeModuleInspector, setActiveModuleInspector] = useState(null);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [isWorkbenchModalOpen, setIsWorkbenchModalOpen] = useState(false);
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [isOutdoors, setIsOutdoors] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isDrivingRover, setIsDrivingRover] = useState(false);
  const isDrivingRoverRef = useRef(false);
  useEffect(() => {
    isDrivingRoverRef.current = isDrivingRover;
  }, [isDrivingRover]);

  const [showDebugColliders, setShowDebugColliders] = useState(false);
  const handleToggleDebugColliders = () => {
    setShowDebugColliders(prev => {
      soundService.playClick();
      return !prev;
    });
  };

  const [isScannerActive, setIsScannerActive] = useState(false);
  const [airlockCycleState, setAirlockCycleState] = useState(null);
  const [playerPose, setPlayerPose] = useState({ position: new THREE.Vector3(0, 1.7, 2.5), yaw: 0 });
  const [scavengedWreck, setScavengedWreck] = useState(false);

  // EVA Suit Oxygen level (100% inside, drains outside)
  const [suitO2, setSuitO2] = useState(100);
  const lastLowO2Warning = useRef(0);
  const lastHealthPenalty = useRef(0);

  // Settings: Mouse sensitivity & graphics
  const [mouseSensitivity, setMouseSensitivity] = useState(() => {
    try {
      const saved = localStorage.getItem('outpost_zero_sensitivity');
      return saved ? parseFloat(saved) : 1.0;
    } catch (e) {
      return 1.0;
    }
  });

  const [graphicsQuality, setGraphicsQuality] = useState(() => {
    try {
      return localStorage.getItem('outpost_zero_graphics') || 'high';
    } catch (e) {
      return 'high';
    }
  });

  // Audio settings
  const [isMuted, setIsMuted] = useState(() => soundService.isMuted());
  const [volume, setVolume] = useState(() => soundService.getVolume());

  const onToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundService.setMuted(next);
  };

  const handleChangeSensitivity = (val) => {
    setMouseSensitivity(val);
    try {
      localStorage.setItem('outpost_zero_sensitivity', val.toString());
    } catch (e) {}
  };

  const handleChangeGraphicsQuality = (val) => {
    setGraphicsQuality(val);
    try {
      localStorage.setItem('outpost_zero_graphics', val);
    } catch (e) {}
  };

  const handleChangeVolume = (val) => {
    setVolume(val);
    soundService.setVolume(val);
  };

  const { moduleHealth, resources } = gameState;

  // EVA Suit Oxygen Simulation Loop (Tick every 200ms)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPauseMenuOpen || airlockCycleState) return;

      const now = Date.now();

      if (!isOutdoors) {
        // Inside habitat: refill suit O2 rapidly
        setSuitO2(prev => Math.min(100, prev + 2.5));
      } else if (isDrivingRover) {
        // Rover Onboard Life Support: mobile suit O2 recharge haven while exploring
        setSuitO2(prev => Math.min(100, prev + 1.8));
      } else {
        // Outside on foot: drain suit O2 (faster when sprinting)
        const drainRate = isSprinting ? 0.16 : 0.08;
        setSuitO2(prev => {
          const next = Math.max(0, prev - drainRate);

          // Audio warning for low O2
          if (next < 25 && next > 0 && now - lastLowO2Warning.current > 4000) {
            soundService.playLowO2Warning();
            lastLowO2Warning.current = now;
          }

          // Asphyxiation health decay if suit O2 is 0%
          if (next <= 0 && now - lastHealthPenalty.current > 2000) {
            lastHealthPenalty.current = now;
            soundService.playAlert();
            if (setGameState) {
              setGameState(old => ({
                ...old,
                resources: {
                  ...old.resources,
                  crew: {
                    ...old.resources.crew,
                    health: Math.max(0, old.resources.crew.health - 2),
                  }
                }
              }));
            }
          }

          return next;
        });
      }
    }, 200);

    return () => clearInterval(timer);
  }, [isOutdoors, isSprinting, isDrivingRover, isPauseMenuOpen, airlockCycleState, setGameState]);

  // Global ESC Key Listener to close any open station modals or pause menu cleanly
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.code === 'Escape') {
        if (activeModuleInspector) {
          e.preventDefault();
          setActiveModuleInspector(null);
          soundService.playClick();
          return;
        }
        if (isCommandModalOpen) {
          e.preventDefault();
          setIsCommandModalOpen(false);
          soundService.playClick();
          return;
        }
        if (isWorkbenchModalOpen) {
          e.preventDefault();
          setIsWorkbenchModalOpen(false);
          soundService.playClick();
          return;
        }
        if (isPauseMenuOpen) {
          e.preventDefault();
          setIsPauseMenuOpen(false);
          soundService.playClick();
          return;
        }
        if (isScannerActive) {
          e.preventDefault();
          setIsScannerActive(false);
          return;
        }
        // If no modal was open, open the pause menu
        e.preventDefault();
        setIsPauseMenuOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeModuleInspector, isCommandModalOpen, isWorkbenchModalOpen, isPauseMenuOpen, isScannerActive]);

  // Station ID to Module ID mapping
  const STATION_MODULE_MAP = {
    hydroponics: MODULE_IDS.GREENHOUSE,
    life_support: MODULE_IDS.LIFE_SUPPORT,
    water_recycler: MODULE_IDS.WATER_RECYCLING,
    solar_array: MODULE_IDS.SOLAR_ARRAY,
  };

  const handleStationInteract = (stationId) => {
    soundService.playClick();

    if (stationId === 'command_console') {
      setIsCommandModalOpen(true);
    } else if (stationId === 'repair_bench') {
      setIsWorkbenchModalOpen(true);
    } else if (stationId === 'rad_shelter' || stationId === 'comms_dish') {
      onTabChange('radiation');
    } else if (stationId === 'solar_ridge' || stationId === 'solar_array') {
      setActiveModuleInspector(MODULE_IDS.SOLAR_ARRAY);
    } else if (stationId === 'ice_drill') {
      // Harvest subsurface ice with Sol-cooldown protection
      const lastHarvest = gameState.exploration?.lastIceHarvestSol || 0;
      if (gameState.currentSol > lastHarvest && setGameState) {
        soundService.playSampleHarvest();
        setGameState(prev => ({
          ...prev,
          resources: {
            ...prev.resources,
            water: {
              ...prev.resources.water,
              current: Math.min(prev.resources.water.max, prev.resources.water.current + 60),
            }
          },
          exploration: {
            ...prev.exploration,
            iceHarvestCount: (prev.exploration?.iceHarvestCount || 0) + 1,
            lastIceHarvestSol: prev.currentSol,
          },
          alerts: [
            {
              id: `ice_${Date.now()}`,
              sol: prev.currentSol,
              type: 'success',
              title: 'Subsurface Permafrost Ice Harvested',
              description: 'Melt drill harvested 60 Liters of pure water. Transferred to Outpost reservoirs.',
              resolved: true,
            },
            ...(prev.alerts || [])
          ]
        }));
      } else {
        setActiveModuleInspector(MODULE_IDS.WATER_RECYCLING);
      }
    } else if (stationId === 'geo_samples') {
      // Collect geological core sample canister from ridge outcrop
      soundService.playSampleHarvest();
      if (setGameState) {
        setGameState(prev => ({
          ...prev,
          exploration: {
            ...prev.exploration,
            collectedGeoCores: (prev.exploration?.collectedGeoCores || 0) + 1,
          },
          alerts: [
            {
              id: `geo_${Date.now()}`,
              sol: prev.currentSol,
              type: 'info',
              title: 'Regolith Core Collected',
              description: 'Sedimentary drill sample secured in pressurized canister. Ready for analysis at Workbench.',
              resolved: true,
            },
            ...(prev.alerts || [])
          ]
        }));
      }
    } else if (stationId === 'weather_beacon') {
      // Deploy/align crater rim early-warning telemetry sensor
      soundService.playBeaconDeploy();
      if (setGameState) {
        setGameState(prev => ({
          ...prev,
          exploration: {
            ...prev.exploration,
            weatherBeaconsActive: 2,
          },
          alerts: [
            {
              id: `beacon_${Date.now()}`,
              sol: prev.currentSol,
              type: 'success',
              title: 'Crater Rim Weather Telemetry Online',
              description: 'High-gain solar radiometer and anemometer aligned. Dust storm prediction accuracy elevated.',
              resolved: true,
            },
            ...(prev.alerts || [])
          ]
        }));
      }
    } else if (stationId === 'airlock') {
      // Trigger working airlock cycle sequence
      const goingOutside = (playerPose.position?.x || 0) < 11.5;
      setAirlockCycleState({ isGoingOutdoors: goingOutside });
    } else if (stationId === 'mars_rover' || isDrivingRoverRef.current) {
      // Unconditionally toggle mount/dismount using mutable ref to prevent stale closures
      const nextDriving = !isDrivingRoverRef.current;
      isDrivingRoverRef.current = nextDriving;
      setIsDrivingRover(nextDriving);
      if (canvasRef.current) {
        canvasRef.current.setDrivingRover(nextDriving);
      }
      soundService.playRoverMount();
      return;
    } else if (stationId === 'scavenge_wreck') {
      if (!scavengedWreck && setGameState) {
        setScavengedWreck(true);
        soundService.playAdvanceSol();
        setGameState(prev => ({
          ...prev,
          resources: {
            ...prev.resources,
            spareParts: {
              ...prev.resources.spareParts,
              current: Math.min(prev.resources.spareParts.max, prev.resources.spareParts.current + 4),
            }
          },
          alerts: [
            {
              id: `scavenge_${Date.now()}`,
              sol: prev.currentSol,
              type: 'success',
              title: 'Supply Drop Scavenged',
              description: 'Emergency supply cargo recovered from wreckage: +4 Spare Parts added to inventory.',
              resolved: true,
            },
            ...(prev.alerts || [])
          ]
        }));
      } else {
        setIsWorkbenchModalOpen(true);
      }
    } else if (STATION_MODULE_MAP[stationId]) {
      setActiveModuleInspector(STATION_MODULE_MAP[stationId]);
    }
  };

  // Airlock cycle completion handler
  const handleAirlockComplete = () => {
    if (!airlockCycleState) return;

    if (airlockCycleState.isGoingOutdoors) {
      // Teleport outside airlock door onto landing pad facing East
      if (canvasRef.current) {
        canvasRef.current.teleport(14.5, 1.7, 0, -Math.PI / 2);
      }
      setIsOutdoors(true);
    } else {
      // Teleport inside airlock bay facing West towards Central Hub
      if (canvasRef.current) {
        canvasRef.current.teleport(7.5, 1.7, 0, Math.PI / 2);
      }
      setIsOutdoors(false);
    }

    setAirlockCycleState(null);
  };

  // Tactical Scanner Toggle
  const handleToggleScanner = () => {
    setIsScannerActive(prev => {
      soundService.playScannerToggle(!prev);
      return !prev;
    });
  };

  const isAnyModalOpen = Boolean(
    activeModuleInspector || 
    isCommandModalOpen || 
    isWorkbenchModalOpen || 
    isPauseMenuOpen ||
    airlockCycleState
  );

  return (
    <div className="relative w-screen h-screen bg-space-950 overflow-hidden select-none">
      {/* 1. 3D Astroneer/ARK-style Mars Outpost Canvas */}
      <OutpostCanvas
        ref={canvasRef}
        gameState={gameState}
        onStationInteract={handleStationInteract}
        onNearbyStationChange={(station) => setNearbyStation(station)}
        onOutdoorsChange={setIsOutdoors}
        onSprintingChange={setIsSprinting}
        onDrivingChange={(driving) => {
          isDrivingRoverRef.current = driving;
          setIsDrivingRover(driving);
        }}
        onPlayerPoseChange={(pos, yaw) => setPlayerPose({ position: pos.clone(), yaw })}
        onTogglePause={() => setIsPauseMenuOpen(prev => !prev)}
        onToggleScanner={handleToggleScanner}
        onToggleDebugColliders={handleToggleDebugColliders}
        showDebugColliders={showDebugColliders}
        mouseSensitivity={mouseSensitivity}
        graphicsQuality={graphicsQuality}
        isPaused={isAnyModalOpen}
      />

      {/* 2. First-Person Visor HUD Overlay */}
      <FirstPersonHUD
        gameState={gameState}
        nearbyStation={nearbyStation}
        onInteract={handleStationInteract}
        onAdvanceSol={onAdvanceSol}
        onTabChange={onTabChange}
        activeTab={activeTab}
        onOpenIntro={onOpenIntro}
        onOpenPause={() => setIsPauseMenuOpen(true)}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        isPointerLocked={!isAnyModalOpen}
        isOutdoors={isOutdoors}
        suitO2={suitO2}
        isSprinting={isSprinting}
        isDrivingRover={isDrivingRover}
        isScannerActive={isScannerActive}
        onToggleScanner={handleToggleScanner}
        playerPosition={playerPose.position}
        playerYaw={playerPose.yaw}
      />

      {/* 3. Visor Holographic Scanner Overlay (Toggled with [F]) */}
      {isScannerActive && !isAnyModalOpen && (
        <VisorScannerOverlay
          gameState={gameState}
          playerPose={playerPose}
          isOutdoors={isOutdoors}
          isDrivingRover={isDrivingRover}
          onClose={() => setIsScannerActive(false)}
        />
      )}

      {/* 4. Working Airlock Pressurization Cycle Overlay */}
      {airlockCycleState && (
        <AirlockCycleOverlay
          isGoingOutdoors={airlockCycleState.isGoingOutdoors}
          onComplete={handleAirlockComplete}
        />
      )}

      {/* 5. Pause Menu Modal */}
      <PauseMenuModal
        isOpen={isPauseMenuOpen}
        onResume={() => {
          soundService.playClick();
          setIsPauseMenuOpen(false);
        }}
        onRestart={onRestartMission}
        mouseSensitivity={mouseSensitivity}
        onChangeSensitivity={handleChangeSensitivity}
        graphicsQuality={graphicsQuality}
        onChangeGraphicsQuality={handleChangeGraphicsQuality}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        volume={volume}
        onChangeVolume={handleChangeVolume}
        showDebugColliders={showDebugColliders}
        onToggleDebugColliders={handleToggleDebugColliders}
      />

      {/* 6. Command Console Terminal Modal */}
      <CommandConsoleModal
        isOpen={isCommandModalOpen}
        onClose={() => {
          soundService.playClick();
          setIsCommandModalOpen(false);
        }}
        gameState={gameState}
        onAdvanceSol={onAdvanceSol}
        onOpenRadiation={() => onTabChange('radiation')}
        onOpenEventLog={() => onTabChange('events')}
        onAssignCrew={(memberId, newStation) => {
          if (setGameState) {
            setGameState(prev => ({
              ...prev,
              crewMembers: (prev.crewMembers || []).map(m =>
                m.id === memberId ? { ...m, assignment: newStation } : m
              )
            }));
          }
        }}
      />

      {/* 7. Storage & Repair Workbench Modal */}
      <WorkbenchModal
        isOpen={isWorkbenchModalOpen}
        onClose={() => {
          soundService.playClick();
          setIsWorkbenchModalOpen(false);
        }}
        gameState={gameState}
        onRepairModule={onRepairModule}
        onAnalyzeCore={() => {
          if (setGameState) {
            soundService.playSampleHarvest();
            setGameState(prev => {
              const collected = prev.exploration?.collectedGeoCores || 0;
              const analyzed = prev.exploration?.analyzedGeoCores || 0;
              if (collected <= analyzed) return prev;

              return {
                ...prev,
                resources: {
                  ...prev.resources,
                  spareParts: {
                    ...prev.resources.spareParts,
                    current: Math.min(prev.resources.spareParts.max, prev.resources.spareParts.current + 2),
                  },
                  crew: {
                    ...prev.resources.crew,
                    morale: Math.min(100, (prev.resources.crew?.morale || 95) + 5),
                  }
                },
                exploration: {
                  ...prev.exploration,
                  analyzedGeoCores: analyzed + 1,
                },
                alerts: [
                  {
                    id: `analysis_${Date.now()}`,
                    sol: prev.currentSol,
                    type: 'success',
                    title: 'Regolith Core Analyzed',
                    description: 'Mass spectrometer extracted structural titanium silicates: +2 Spare Parts manufactured & +5 Morale.',
                    resolved: true,
                  },
                  ...(prev.alerts || [])
                ]
              };
            });
          }
        }}
      />

      {/* 8. Specific Module Inspector Modal (O2 Bay, Water Bay, Hydroponics, Solar) */}
      {activeModuleInspector && (
        <RoomDetailsPanel
          selectedModuleId={activeModuleInspector}
          onClose={() => {
            soundService.playClick();
            setActiveModuleInspector(null);
          }}
          moduleHealth={moduleHealth[activeModuleInspector] ?? 100}
          sparePartsAvailable={resources?.spareParts?.current || 0}
          onRepairModule={onRepairModule}
        />
      )}
    </div>
  );
}
