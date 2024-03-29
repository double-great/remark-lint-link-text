/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextNode } from "./index.js";

export type RuleProps = {
  id: string;
  heading: string;
  docs: string;
  rationale: string;
  ok: string;
  notOk: string;
  listen?: string;
  note?: string;
};

export default class Rule {
  id: string;
  heading: string;
  docs: string;
  rationale: string;
  ok: string;
  notOk: string;
  listen?: string;
  note?: string;
  recommendation!: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;

  constructor(props: RuleProps) {
    this.id = props.id;
    this.heading = props.heading;
    this.docs = props.docs;
    this.rationale = props.rationale;
    this.ok = props.ok;
    this.notOk = props.notOk;
    this.listen = props.listen;
    this.note = props.note;
  }

  check({
    text,
    node,
    nodes,
    altText,
    hasImage,
  }: {
    text: string;
    node?: TextNode;
    nodes?: TextNode[];
    altText?: string;
    hasImage?: boolean;
    config?: unknown;
  }): string | undefined {
    throw new Error("check() method not implemented.");
  }

  setRecommendation(value?: string) {
    throw new Error("setRecommendation() method not implemented.");
  }

  suggestion() {
    return `${this.recommendation} (${this.docs})`;
  }

  document() {
    const codeDisable = `["@double-great/remark-lint-link-text", [1, ${JSON.stringify(
      {
        [this.id]: false,
      },
    )}]]`;
    const codeOptions = `["@double-great/remark-lint-link-text", [1, ${JSON.stringify(
      {
        [this.id]: this.config,
      },
    )}]]`;
    return `### ${this.heading}

${this.rationale}

🚫 The following markdown will cause a warning:

${this.notOk}

✅ The following markdown will _not_ cause a warning:

${this.ok}

Configuration:

<!-- prettier-ignore-start -->
\`\`\`js
// disable the rule:
${codeDisable}${
      this.config
        ? `
// adjust rule defaults:
${codeOptions}`
        : ""
    }
\`\`\`
<!-- prettier-ignore-end -->
${
  this.note
    ? `
💡 ${this.note}
`
    : ""
}`;
  }
}
