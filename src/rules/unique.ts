import { TextNode } from "../index.js";
import Rule, { RuleProps } from "../rule.js";

class CheckUniqueLinkText extends Rule {
  constructor(props: RuleProps) {
    super(props);
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

const checkUniqueLinkText = new CheckUniqueLinkText({
  id: "unique",
  heading: "Link text is not unique",
  docs: "https://tinyurl.com/y94y3t7p",
  rationale: `This warning relates to [WCAG 2.4.9 Link Purpose (Link Only) (AAA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=249#link-purpose-link-only) and [WCAG 3.2.4 Consistent Navigation (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=324#consistent-identification). Links with different purposes and destinations should have different link text. Descriptive link text communicates a link’s purpose even when the context is missing. A screen reader listing all of the links on a page is an example where the context would be missing.`,
  note: `This check does not account for techniques that use \`aria-label\` or \`aria-labelledby\` attributes to provide additional link context. Context provided by content that surrounds the link, as allowed by [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context), is not considered by this check.`,
  notOk: `\`\`\`md
- [Example](https://example.com/team)
- [Example](https://example.com/about)
\`\`\``,
  ok: `\`\`\`md
- [Example team](https://example.com/team)
- [About Example](https://example.com/about)
\`\`\``,
});

export default checkUniqueLinkText;
