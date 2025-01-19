import { lintRule, Severity, Label } from "unified-lint-rule";
import { visit } from "unist-util-visit";
import checkIsNotEmptyNoAlt from "./rules/empty-no-alt.js";
import checkIsNotEmpty from "./rules/empty.js";
import checkNotDescriptive from "./rules/not-descriptive.js";
import checkIsNotUrl from "./rules/url.js";
import checkUniqueLinkText from "./rules/unique.js";
import checkEmail from "./rules/email.js";
import { Node } from "unist";
import { VFile } from "vfile";
import { VFileMessage } from "vfile-message";
import { TransformCallback } from "unified";

export type Config = {
  "not-descriptive": boolean | string[];
  empty: boolean;
  "empty-alt-text": boolean;
  "not-url": boolean;
  unique: boolean;
  email: boolean;
};

const checkLinkText: Plugin = lintRule(
  {
    origin: "remark-lint:link-text",
    url: "https://github.com/double-great/remark-lint-link-text",
  },
  (tree: Node, file: VFile, options?: Config): void => {
    const textToNodes: { [text: string]: TextNode[] } = {};

    const config = {
      "not-descriptive": true,
      empty: true,
      "empty-alt-text": true,
      "not-url": true,
      unique: true,
      email: true,
      ...options,
    };

    const aggregate = (node: TextNode) => {
      function message(message: string | undefined) {
        if (!message) return;
        const origin = "remark-lint:link-text";
        file.message(new VFileMessage(message), node.position, origin);
      }

      const hasImage =
        node.children.filter(({ type }) => type === "image").length > 0;

      // recursively return all values from node.children
      const getText = (node: TextNode): string => {
        if (node.value) {
          return node.value;
        } else if (node.children) {
          return node.children.map(getText).join(" ");
        }
        return "";
      };

      const text = getText(node);

      const altText = node.children
        .filter(({ type }) => type === "image")
        .map(({ alt }) => alt)
        .join(" ");

      if (config["empty"]) {
        message(checkIsNotEmpty.check({ node, text, altText, hasImage }));
      }
      if (config["empty-alt-text"]) {
        message(checkIsNotEmptyNoAlt.check({ node, text, altText, hasImage }));
      }
      if (config["not-descriptive"]) {
        message(
          checkNotDescriptive.check({
            text,
            config: config["not-descriptive"],
          }),
        );
      }
      if (config["not-url"]) {
        message(checkIsNotUrl.check({ text }));
      }
      if (config["email"]) {
        message(checkEmail.check({ node, text }));
      }

      if (!textToNodes[text]) {
        textToNodes[text] = [];
      }
      textToNodes[text].push(node);
    };

    visit(tree, "link", aggregate);

    if (config["unique"]) {
      for (const text of Object.keys(textToNodes)) {
        const nodes = textToNodes[text];
        const notes = checkUniqueLinkText.check({ text, nodes });
        if (notes) file.message(notes, nodes[0]);
      }
    }
  },
);

export default checkLinkText;

export type TextNode = {
  type: "text" | "image";
  title: string | null;
  url?: string;
  alt?: string;
  value: string | undefined;
  position: {
    start: { line: number; column: number; offset?: number };
    end: { line: number; column: number; offset?: number };
    indent?: number[];
  };
  children: TextNode[];
};

type Plugin = (
  config?:
    | Label
    | Severity
    | Config
    | [level: Label | Severity, option?: Config | undefined]
    | undefined,
) =>
  | ((tree: Node, file: VFile, next: TransformCallback) => undefined)
  | undefined;
