export const VOICES = {
  Vortex: "voice_5uv6itknrlr5",
} as const;

export type RoastPersona = keyof typeof VOICES;

export const selectedVoice = "voice_5uv6itknrlr5";