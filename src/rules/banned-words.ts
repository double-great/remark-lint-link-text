import banned from "../banned.js";
import Rule from "../rule.js";

class CheckBannedWords extends Rule {
  constructor() {
    super();
    this.recommendation = this.setRecommendation();
  }

  check({ text }: { text: string }) {
    if (!banned.includes(text.toLowerCase())) return;
    this.recommendation = this.setRecommendation(text);
    return this.suggestion();
  }

  setRecommendation(value?: string) {
    return `Avoid using the link text “${value},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`;
  }
}

const checkBannedWords = new CheckBannedWords();

export default checkBannedWords;
