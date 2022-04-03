import { TextNode } from "../index.js";
import Rule from "../rule.js";

class CheckIsNotEmptyNoAlt extends Rule {
  constructor() {
    super();
    this.recommendation = this.setRecommendation();
  }

  check({
    node,
    text,
    altText,
    hasImage,
  }: {
    node: TextNode;
    text: string;
    altText: string;
    hasImage: boolean;
  }) {
    if (!text && !altText && hasImage) {
      this.recommendation = this.setRecommendation(text, node);
      return this.suggestion();
    }
  }

  setRecommendation(value?: string, node?: TextNode) {
    return `The link “${
      node ? node.url : ""
    }” must have link text or the image inside the link must have alt text`;
  }
}

const checkIsNotEmptyNoAlt = new CheckIsNotEmptyNoAlt();

export default checkIsNotEmptyNoAlt;
