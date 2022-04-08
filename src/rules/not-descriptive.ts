import { Config } from "../index.js";
import Rule, { RuleProps } from "../rule.js";

class CheckNotDescriptive extends Rule {
  constructor(props: RuleProps) {
    super(props);
    // prettier-ignore
    this.config = [
      "about", "button", "can be found here", "click", "click here", "continue", "continue reading", "details", "email", "figure", "found here", "here", "learn more", "link", "more", "more details", "more here", "online", "read more", "resource", "the article", "the document", "the entry", "the link", "the page", "the post", "the site", "the website", "this article", "this document", "this entry", "this link", "this page", "this post", "this site", "this website", "url", "website"
    ];
    this.recommendation = this.setRecommendation();
  }

  check({ text, config }: { text: string; config: Config["not-descriptive"] }) {
    if (Array.isArray(config)) this.config = config;

    if (this.config.includes(text.toLowerCase())) {
      this.recommendation = this.setRecommendation(text);
      return this.suggestion();
    }

    for (const start of starts) {
      if (!text.toLowerCase().startsWith(start)) continue;
      for (const regex of bannedRegex(this.config)) {
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

const checkNotDescriptive = new CheckNotDescriptive({
  id: "not-descriptive",
  heading: "Link text is not descriptive",
  docs: "https://tinyurl.com/ycafcwtx",
  rationale: `Pulling from this library’s list of bad link text, any link text that matches this list will be flagged. Using non-specific link text is a [failure of WCAG 2.4.9 (AAA)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F84.html).`,
  note: `For all banned phrases that begin with \`this\` or \`the\`, any words that come between will also fail. For example “this post”, “this W3C post”, and “this W3C blog post” will all fail.`,
  notOk: `\`\`\`md
- [click here](https://example.com/team)
\`\`\``,
  ok: `\`\`\`md
- [Example team](https://example.com/team)
\`\`\``,
});

export const starts = ["this", "the"];
export const bannedRegex = (config: string[]) =>
  config.reduce((arr: string[], b: string) => {
    for (const s of starts) {
      const trimmed = b.replace(s, "").trim();
      if (b.startsWith(s) && !arr.includes(trimmed))
        arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
    }
    return arr;
  }, []);

export default checkNotDescriptive;
