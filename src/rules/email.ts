import { TextNode } from "../index.js";
import Rule from "../rule.js";

class CheckEmail extends Rule {
  constructor() {
    super();
    this.recommendation = this.setRecommendation();
  }

  check({ node, text }: { node: TextNode; text: string }) {
    const { url } = node;
    if (!url || !url.startsWith("mailto:")) return;
    const emailArray = url.split("?");
    const email = emailArray[0].replace("mailto:", "");
    if (!text.includes(email)) {
      this.recommendation = this.setRecommendation(email);
      return this.suggestion();
    }
  }

  setRecommendation(value?: string) {
    return `Text must include email “${value}” because the link URL will generate an email message`;
  }
}

const checkEmail = new CheckEmail();

export default checkEmail;
