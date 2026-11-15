/**
 * Outpost Zero - Decision Resolution Engine
 * Handles player choices, checks resource requirements, executes trade-offs.
 */

import { CORE_EVENTS_CATALOG } from '../data/events.js';

/**
 * Validates if the player currently has the resources required for a choice.
 */
export function canAffordChoice(choice, state) {
  if (!choice.cost) return true;

  if (choice.cost.spareParts && state.resources.spareParts.current < choice.cost.spareParts) {
    return false;
  }
  if (choice.cost.energy && state.resources.energy.current < choice.cost.energy) {
    return false;
  }
  if (choice.cost.water && state.resources.water.current < choice.cost.water) {
    return false;
  }
  if (choice.cost.food && state.resources.food.current < choice.cost.food) {
    return false;
  }

  return true;
}

/**
 * Resolves an active event choice and applies its immediate and multi-Sol effects.
 * 
 * @param {Object} state - Current game state
 * @param {string} eventId - ID of the event
 * @param {string} choiceId - ID of selected choice
 * @returns {Object} { nextState, resolutionMessage }
 */
export function resolveEventDecision(state, eventId, choiceId) {
  const next = JSON.parse(JSON.stringify(state));
  const eventDef = CORE_EVENTS_CATALOG[eventId];
  if (!eventDef) return { nextState: next, resolutionMessage: 'Event not found.' };

  const choice = eventDef.choices.find(c => c.id === choiceId);
  if (!choice) return { nextState: next, resolutionMessage: 'Choice not found.' };

  if (!canAffordChoice(choice, next)) {
    return { nextState: next, error: 'Insufficient resources to execute this decision.' };
  }

  // Execute choice effect on the cloned state
  const resolutionMessage = choice.apply(next);

  // Archive into resolvedEvents
  if (!next.resolvedEvents) next.resolvedEvents = [];
  next.resolvedEvents.push({
    eventId,
    choiceId,
    sol: next.currentSol,
    title: eventDef.title,
    choiceLabel: choice.label,
    resolutionMessage,
    resolvedAt: new Date().toISOString(),
  });

  // Clear from pendingDecisions
  next.pendingDecisions = (next.pendingDecisions || []).filter(e => e.id !== eventId);

  // Add notification to alerts
  if (!next.alerts) next.alerts = [];
  next.alerts.unshift({
    id: `resolved_${eventId}_${next.currentSol}`,
    sol: next.currentSol,
    type: 'success',
    title: `Resolved: ${eventDef.title}`,
    description: resolutionMessage,
    resolved: true,
  });

  return {
    nextState: next,
    resolutionMessage,
  };
}
