export const VOICES = {
  Vortex: "charon",
} as const;

export type RoastPersona = keyof typeof VOICES;

export const selectedVoice = "charon";