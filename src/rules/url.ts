import Rule, { RuleProps } from "../rule.js";

class CheckIsNotUrl extends Rule {
  constructor(props: RuleProps) {
    super(props);
    this.recommendation = this.setRecommendation();
  }

  check({ text }: { text: string }) {
    if (
      !text.match(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
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

const checkIsNotUrl = new CheckIsNotUrl({
  id: "not-url",
  heading: "Link text is a URL",
  docs: "https://doublegreat.dev/remark-lint-link-text/#link-text-is-a-url",
  rationale: `[WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context) considers a link containing text that gives a description of the information at that URL a sufficient technique. When a URL is the link text, screen readers have to listen while the reader pronounces every single character of a URL. Audibly, this is less descriptive and more time consuming to listen to than descriptive link text. [WebAIM’s Links and Hypertext page](https://webaim.org/techniques/hypertext/link_text) explains the challenges of [URLs as links](https://webaim.org/techniques/hypertext/link_text#urls).`,
  note: `This check is at odds with some stylistic guidelines, like APA. The [APA Style’s Accessible URLs page](https://apastyle.apa.org/style-grammar-guidelines/paper-format/accessibility/urls) provides some rationale for their guidelines as it relates to [WCAG 2.4.4](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context).`,

  notOk: `\`\`\`md
[https://www.w3c.org/WAI/fundamentals/accessibility-intro/](https://www.w3c.org/WAI/fundamentals/accessibility-intro/)
\`\`\`

When read aloud, users will hear “h t t p s colon slash slash w w w dot w 3 c dot org slash w a i slash fundementals slash accessibility dash intro slash, link”.`,

  ok: `\`\`\`md
[Introduction to Web Accessibility](https://www.w3c.org/WAI/fundamentals/accessibility-intro/)
\`\`\`

When read aloud, users will hear “Introduction to Web Accessibility, link”.`,
});

export default checkIsNotUrl;
