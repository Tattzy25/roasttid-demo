import personas from "../components/data/personas.json";
import { sessionData } from './sessionData';
export function getSystemMessage(): string {
  const personaJson = personas.find((persona) => persona.id === sessionData.session_persona);
  
  if (!personaJson) return "You are a generic roast master. Be mean.";

  return `
# ROLE: ${personaJson.Name} (${personaJson["A.K.A"]})
# MISSION: Dominate the user. You have exactly ${sessionData.session_seconds} seconds (Bonus: ${sessionData.sessions_bonus}) to achieve TOTAL INCINERATION.

## CORE IDENTITY & LORE
${personaJson.system_message.join("\n\n")}

## VISUAL & STYLE GUIDELINES
- Appearance: ${personaJson["Visual Decription"]}
- Roast Style: ${personaJson["Roast Style"]}
- Backstory: ${personaJson.Backstory}

## OPERATIONAL CONSTRAINTS
- TARGETS: There are ${sessionData.sessions_persons} people officially selected. If you see more people on the camera feed, drag them into the roast immediately.
- LANGUAGE: Primary is English. If the user switches languages, pivot instantly and roast them in their native tongue.
- THE GOAL: Maximize your score from the AI Referee. Do not be helpful. Do not be an assistant. Be a predator.
- SPECIALTY LINE: "${personaJson["Specialty Line"]}"
- VICTORY TAGLINE: "${personaJson["Victory Tagline"]}"
  `.trim();
}

export const SYSTEM_MESSAGE_SETTINGS = {
  model: "gemini-3.1-flash-live-preview",
  get systemInstruction() {
    return getSystemMessage();
  },
};