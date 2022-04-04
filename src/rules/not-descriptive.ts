import banned from "../banned.js";
import Rule, { RuleProps } from "../rule.js";

class CheckNotDescriptive extends Rule {
  constructor(props: RuleProps) {
    super(props);
    this.recommendation = this.setRecommendation();
  }

  check({ text }: { text: string }) {
    if (banned.includes(text.toLowerCase())) {
      this.recommendation = this.setRecommendation(text);
      return this.suggestion();
    }

    for (const start of starts) {
      if (!text.toLowerCase().startsWith(start)) continue;
      for (const regex of bannedRegex) {
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
  rationale: `Pulling from [this library’s list of bad link text](src/banned.ts), any link text that matches this list will be flagged. Using non-specific link text is a [failure of WCAG 2.4.9 (AAA)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F84.html).

Here’s a sample of the phrases in [\`src/banned.ts\`](src/banned.ts):

- click here
- read more
- learn more
- website
- found here
- this article`,
  note: `For all banned phrases that begin with \`this\` or \`the\`, any words that come between will also fail. For example “this post”, “this W3C post”, and “this W3C blog post” will all fail.`,
  notOk: `\`\`\`md
- [click here](https://example.com/team)
\`\`\``,
  ok: `\`\`\`md
- [Example team](https://example.com/team)
\`\`\``,
});

export const starts = ["this", "the"];
export const bannedRegex = banned.reduce((arr: string[], b: string) => {
  for (const s of starts) {
    const trimmed = b.replace(s, "").trim();
    if (b.startsWith(s) && !arr.includes(trimmed))
      arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
  }
  return arr;
}, []);

export default checkNotDescriptive;
