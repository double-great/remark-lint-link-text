import banned from "../banned.js";
import { Config } from "../index.js";

export default function checkRegexBannedWords({
  text,
  config,
}: {
  text: string;
  config: Config;
}) {
  const disallowList = Array.isArray(config["banned-words"])
    ? config["banned-words"]
    : banned;

  for (const start of starts) {
    if (!text.toLowerCase().startsWith(start)) continue;
    const disallowed = bannedRegex(disallowList);
    for (const regex of disallowed) {
      if (new RegExp(`${regex}`, "i").test(text)) {
        return `Avoid using the link text “${text},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`;
      }
    }
  }
}

export const starts = ["this", "the"];
export const bannedRegex = (disallowList: string[]) => {
  return disallowList.reduce((arr: string[], b: string) => {
    for (const s of starts) {
      const trimmed = b.replace(s, "").trim();
      if (b.startsWith(s) && !arr.includes(trimmed))
        arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
    }
    return arr;
  }, []);
};
