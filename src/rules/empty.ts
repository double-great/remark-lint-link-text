import { TextNode } from "../index.js";
import Rule, { RuleProps } from "../rule.js";

class CheckIsNotEmpty extends Rule {
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
    const isEmptyLink =
      node.type === "link" && !node.title && !node.children.length;
    if (!text && !altText && !hasImage && isEmptyLink) {
      this.recommendation = this.setRecommendation(text, node);
      return this.suggestion();
    }
  }

  setRecommendation(value?: string, node?: TextNode) {
    return `The link “${node ? node.url : ""}” must have link text`;
  }
}

const checkIsNotEmpty = new CheckIsNotEmpty({
  id: "empty",
  heading: "Link text is missing",
  docs: "https://doublegreat.dev/remark-lint-link-text/#link-text-is-missing",
  rationale: `In markdown, missing link text is often an oversight. Although an [\`<a>\` element without a \`href\` attribute is valid](https://html.spec.whatwg.org/#the-a-element) HTML, [WebAIM suggests that empty links can be very confusing](https://webaim.org/techniques/hypertext/link_text#empty_links) to keyboard and screen reader users and should be avoided completely.`,
  notOk: `\`\`\`md
[](https://example.com)
\`\`\``,
  ok: `\`\`\`md
[Example](https://example.com)
\`\`\``,
});

export default checkIsNotEmpty;
