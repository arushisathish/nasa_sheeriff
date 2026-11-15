/**
 * Outpost Zero - NASA Curiosity RAD Historical Telemetry & Scientific Reference
 * 
 * Based on published Science / JGR data from the Mars Science Laboratory (MSL)
 * Curiosity Rover's Radiation Assessment Detector (RAD) in Gale Crater.
 */

// 30-Sol Historical Curiosity RAD Dataset (Gale Crater baseline + September 2017 SPE event)
export const CURIOSITY_HISTORICAL_RAD_DATA = [
  { sol: 1, curiosityHistorical_uSv_h: 21.2, simulatedSurface_uSv_h: 21.4, shelteredBunker_uSv_h: 2.1, event: 'Quiet Sun GCR' },
  { sol: 2, curiosityHistorical_uSv_h: 21.5, simulatedSurface_uSv_h: 21.3, shelteredBunker_uSv_h: 2.0, event: 'Quiet Sun GCR' },
  { sol: 3, curiosityHistorical_uSv_h: 20.8, simulatedSurface_uSv_h: 21.1, shelteredBunker_uSv_h: 2.0, event: 'Quiet Sun GCR' },
  { sol: 4, curiosityHistorical_uSv_h: 21.9, simulatedSurface_uSv_h: 21.6, shelteredBunker_uSv_h: 2.1, event: 'Quiet Sun GCR' },
  { sol: 5, curiosityHistorical_uSv_h: 22.1, simulatedSurface_uSv_h: 21.8, shelteredBunker_uSv_h: 2.2, event: 'Quiet Sun GCR' },
  { sol: 6, curiosityHistorical_uSv_h: 21.4, simulatedSurface_uSv_h: 21.5, shelteredBunker_uSv_h: 2.1, event: 'Quiet Sun GCR' },
  { sol: 7, curiosityHistorical_uSv_h: 20.9, simulatedSurface_uSv_h: 21.2, shelteredBunker_uSv_h: 2.0, event: 'Quiet Sun GCR' },
  { sol: 8, curiosityHistorical_uSv_h: 21.7, simulatedSurface_uSv_h: 21.5, shelteredBunker_uSv_h: 2.1, event: 'Quiet Sun GCR' },
  { sol: 9, curiosityHistorical_uSv_h: 22.3, simulatedSurface_uSv_h: 22.0, shelteredBunker_uSv_h: 2.2, event: 'Minor Flare Watch' },
  { sol: 10, curiosityHistorical_uSv_h: 38.4, simulatedSurface_uSv_h: 36.2, shelteredBunker_uSv_h: 3.5, event: 'Solar Particle Event (M-Class)' },
  { sol: 11, curiosityHistorical_uSv_h: 64.7, simulatedSurface_uSv_h: 62.0, shelteredBunker_uSv_h: 6.1, event: 'Peak SPE Proton Shock' },
  { sol: 12, curiosityHistorical_uSv_h: 42.1, simulatedSurface_uSv_h: 40.5, shelteredBunker_uSv_h: 4.2, event: 'SPE Gradual Decay' },
  { sol: 13, curiosityHistorical_uSv_h: 26.5, simulatedSurface_uSv_h: 25.8, shelteredBunker_uSv_h: 2.5, event: 'SPE Residual Trail' },
  { sol: 14, curiosityHistorical_uSv_h: 21.6, simulatedSurface_uSv_h: 21.4, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 15, curiosityHistorical_uSv_h: 21.2, simulatedSurface_uSv_h: 21.3, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 16, curiosityHistorical_uSv_h: 20.7, simulatedSurface_uSv_h: 21.0, shelteredBunker_uSv_h: 2.0, event: 'Nominal GCR' },
  { sol: 17, curiosityHistorical_uSv_h: 21.8, simulatedSurface_uSv_h: 21.5, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 18, curiosityHistorical_uSv_h: 22.0, simulatedSurface_uSv_h: 21.7, shelteredBunker_uSv_h: 2.2, event: 'Nominal GCR' },
  { sol: 19, curiosityHistorical_uSv_h: 21.4, simulatedSurface_uSv_h: 21.4, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 20, curiosityHistorical_uSv_h: 21.1, simulatedSurface_uSv_h: 21.2, shelteredBunker_uSv_h: 2.0, event: 'Nominal GCR' },
  { sol: 21, curiosityHistorical_uSv_h: 21.5, simulatedSurface_uSv_h: 21.6, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 22, curiosityHistorical_uSv_h: 28.9, simulatedSurface_uSv_h: 27.5, shelteredBunker_uSv_h: 2.8, event: 'Coronal Hole Wind Stream' },
  { sol: 23, curiosityHistorical_uSv_h: 31.2, simulatedSurface_uSv_h: 30.1, shelteredBunker_uSv_h: 3.0, event: 'High Speed Solar Wind' },
  { sol: 24, curiosityHistorical_uSv_h: 24.1, simulatedSurface_uSv_h: 23.5, shelteredBunker_uSv_h: 2.3, event: 'Stream Dissipation' },
  { sol: 25, curiosityHistorical_uSv_h: 21.3, simulatedSurface_uSv_h: 21.4, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 26, curiosityHistorical_uSv_h: 21.0, simulatedSurface_uSv_h: 21.1, shelteredBunker_uSv_h: 2.0, event: 'Nominal GCR' },
  { sol: 27, curiosityHistorical_uSv_h: 21.6, simulatedSurface_uSv_h: 21.5, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 28, curiosityHistorical_uSv_h: 21.9, simulatedSurface_uSv_h: 21.7, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 29, curiosityHistorical_uSv_h: 21.4, simulatedSurface_uSv_h: 21.3, shelteredBunker_uSv_h: 2.1, event: 'Nominal GCR' },
  { sol: 30, curiosityHistorical_uSv_h: 21.1, simulatedSurface_uSv_h: 21.2, shelteredBunker_uSv_h: 2.0, event: 'Nominal GCR' },
];

// Shielding comparison data for bar chart
export const SHIELDING_COMPARISON_DATA = [
  { environment: 'Martian Surface (Unshielded)', doseRate: 21.4, unit: 'μSv/h', attenuation: '0%', fill: '#ef4444' },
  { environment: 'Pressurized Module (Al/Poly)', doseRate: 8.2, unit: 'μSv/h', attenuation: '62%', fill: '#f59e0b' },
  { environment: 'Sub-Regolith Storm Shelter (2.5m)', doseRate: 2.1, unit: 'μSv/h', attenuation: '88%', fill: '#10b981' },
  { environment: 'Earth Surface (Sea Level)', doseRate: 0.27, unit: 'μSv/h', attenuation: '99%', fill: '#38bdf8' },
];

// Scientific Glossary of Space Radiation
export const RADIATION_GLOSSARY = [
  {
    term: 'Galactic Cosmic Rays (GCR)',
    definition: 'High-energy protons (85%), alpha particles (14%), and heavy relativistic nuclei (HZE ions) originating from supernovae remnants outside our solar system. On Mars, GCRs produce a relentless, highly penetrating background dose of ~210–240 μGy/day.',
    countermeasure: 'Thick hydrogen-rich shielding or deep regolith burial (>2 meters). Heavy atomic metals like lead produce secondary neutron cascades and are less effective than water or polyethylene.',
  },
  {
    term: 'Solar Energetic Particles (SEP / SPE)',
    definition: 'Intermittent, intense proton streams accelerated by Coronal Mass Ejections (CMEs) and solar flares. A severe SEP can deliver hundreds of mSv in a single day, causing acute radiation sickness if astronauts are unshielded.',
    countermeasure: 'Immediate evacuation to the Sub-Regolith Radiation Storm Shelter and temporary prohibition of all extravehicular activities (EVAs).',
  },
  {
    term: 'Sievert (Sv) vs. Gray (Gy)',
    definition: 'Gray (Gy) measures the physical energy deposited in matter (1 Joule/kg). The Sievert (Sv) accounts for biological damage by multiplying absorbed dose by radiation quality factors (protons have Q=2–5; heavy HZE ions can have Q=20).',
    countermeasure: 'Astronaut personal dosimeters measure both physical silicon absorbed dose and tissue-equivalent dose.',
  },
  {
    term: 'NASA 600 mSv Career Astronaut Limit',
    definition: 'NASA Standard 3001 caps an astronaut’s lifetime occupational ionizing radiation exposure at 600 mSv. This ceiling limits the estimated lifetime excess risk of exposure-induced death (REID) from cancer to no more than 3%.',
    countermeasure: 'Strict dose budgeting across transit and surface operations. Active monitoring prevents exceeding daily quotas.',
  },
];
