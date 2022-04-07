import { TextNode } from "../index.js";
import Rule, { RuleProps } from "../rule.js";

class CheckIsNotEmptyNoAlt extends Rule {
  constructor(props: RuleProps) {
    super(props);
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

const checkIsNotEmptyNoAlt = new CheckIsNotEmptyNoAlt({
  id: "empty-alt-text",
  heading: "Linked image is missing alt text",
  docs: "https://tinyurl.com/ycg5glhn",
  rationale: `When an image is the only content in a link, alt text is required. In this context, missing alt text is a [failure of WCAG 2.4.4 (A), 2.4.9 (AAA), and 4.1.2 (A)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F89).`,
  note: `When an image is the only content in a link, the image’s alt text effectively becomes the link text. Based on [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context), the alt text should describle the function of the link (instead of describing the image).`,
  notOk: `\`\`\`md
[![](https://example.com/logo.svg)](https://example.com)
\`\`\``,
  ok: `\`\`\`md
[![Example logo](https://example.com/logo.svg)](https://example.com)
\`\`\``,
});

export default checkIsNotEmptyNoAlt;
