import { TextNode } from "../index.js";
import Rule from "../rule.js";

class CheckUniqueLinkText extends Rule {
  constructor() {
    super();
    this.recommendation = this.setRecommendation();
  }

  check({ nodes, text }: { nodes: TextNode[]; text: string }) {
    const uniqueUrls = [...new Set(nodes.map(({ url }) => url))];
    if (uniqueUrls.length <= 1) return;
    this.recommendation = this.setRecommendation(text);
    return this.suggestion();
  }

  setRecommendation(value?: string) {
    return `The link text “${value}” is used more than once with different URLs. Change the link text to be unique to the URL.`;
  }
}

const checkUniqueLinkText = new CheckUniqueLinkText();

export default checkUniqueLinkText;
