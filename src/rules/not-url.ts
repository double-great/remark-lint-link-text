import Rule from "../rule.js";

class CheckIsNotUrl extends Rule {
  constructor() {
    super();
    this.recommendation = this.setRecommendation();
  }

  check({ text }: { text: string }) {
    if (
      !text.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
      )
    )
      return;
    this.recommendation = this.setRecommendation(text);
    return this.suggestion();
  }

  setRecommendation(value?: string) {
    return `Avoid using a URL “${value}” as the link text. Consider users who must speak it out loud and who must listen to a screen reader announce it. Replace it with a short description of the link’s destination.`;
  }
}

const checkIsNotUrl = new CheckIsNotUrl();

export default checkIsNotUrl;
