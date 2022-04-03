import Rule from "../rule.js";
import banned from "../banned.js";

class CheckRegexBannedWords extends Rule {
  constructor() {
    super();
    this.recommendation = this.setRecommendation();
  }

  check({ text }: { text: string }) {
    for (const start of starts) {
      if (!text.toLowerCase().startsWith(start)) continue;
      for (const regex of bannedRegex) {
        if (new RegExp(`${regex}`, "i").test(text)) {
          this.recommendation = this.setRecommendation(text);
          return this.suggestion();
        }
      }
    }
  }

  setRecommendation(value?: string) {
    return `Avoid using the link text “${value},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`;
  }
}

const checkRegexBannedWords = new CheckRegexBannedWords();

export default checkRegexBannedWords;

export const starts = ["this", "the"];
export const bannedRegex = banned.reduce((arr: string[], b: string) => {
  for (const s of starts) {
    const trimmed = b.replace(s, "").trim();
    if (b.startsWith(s) && !arr.includes(trimmed))
      arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
  }
  return arr;
}, []);
