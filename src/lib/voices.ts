import { sessionPersona } from "./sessionData";

export const VOICES = {
  cinder: "voice_5uv6itknrlr5",
  "zero-day": "voice_g9e3rkrceoow",
  vesper: "voice_3n11mcm8gzu3",
} as const;

export type RoastPersona = keyof typeof VOICES;

export const selectedVoice = VOICES[sessionPersona as RoastPersona];
