import { TextNode } from "../index.js";
import Rule, { RuleProps } from "../rule.js";

class CheckEmail extends Rule {
  constructor(props: RuleProps) {
    super(props);
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

const checkEmail = new CheckEmail({
  id: "email",
  heading: "Link to email does not contain email address in link text",
  docs: "https://tinyurl.com/y8aj6o83",
  rationale: `When linking to an email address, using \`mailto:\`, the email address should be in the link text. This provides users with context for what will happen when interacting with the link (a new email message will open in email application). Also, email in the link text is useful context when the link can’t be activated (plain text paste, printed page).`,
  notOk: `\`\`\`md
[Email me](mailto:email@example.com)
\`\`\``,
  ok: `\`\`\`md
[email@example.com](mailto:email@example.com)
\`\`\`

\`\`\`md
[otheremail@example.com](mailto:otheremail@example.com?subject=hello)
\`\`\``,
});

export default checkEmail;
