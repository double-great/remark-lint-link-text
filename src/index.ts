import { lintRule } from "unified-lint-rule";
import { VFile, Node } from "unified-lint-rule/lib";
import { visit } from "unist-util-visit";
import checkIsNotEmptyNoAlt from "./rules/not-empty-no-alt.js";
import checkIsNotEmpty from "./rules/no-empty.js";
import checkRegexBannedWords from "./rules/regex-banned-words.js";
import checkBannedWords from "./rules/banned-words.js";
import checkIsNotUrl from "./rules/not-url.js";
import checkUniqueLinkText from "./rules/unique.js";

export type Config = {
  "banned-words": boolean | string[];
  empty: boolean;
  "empty-alt-text": boolean;
  "not-url": boolean;
  unique: boolean;
};

const checkLinkText = lintRule(
  "remark-lint:link-text",
  (tree: Node, file: VFile, options?: Config): void => {
    const textToNodes: { [text: string]: TextNode[] } = {};

    const config = {
      "banned-words": true,
      empty: true,
      "empty-alt-text": true,
      "not-url": true,
      unique: true,
      ...options,
    };

    const aggregate = (node: TextNode) => {
      const message = (message: string | undefined) =>
        message ? file.message(message, node) : "";

      const hasImage =
        node.children.filter(({ type }) => type === "image").length > 0;

      const text = node.children
        .filter(({ type }) => type === "text")
        .map(({ value }) => value)
        .join(" ");

      const altText = node.children
        .filter(({ type }) => type === "image")
        .map(({ alt }) => alt)
        .join(" ");

      if (config["empty"])
        message(checkIsNotEmpty({ node, text, altText, hasImage }));
      if (config["empty-alt-text"])
        message(checkIsNotEmptyNoAlt({ node, text, altText, hasImage }));
      if (config["banned-words"])
        message(checkRegexBannedWords({ text, config }));
      if (config["banned-words"]) message(checkBannedWords({ text, config }));
      if (config["not-url"]) message(checkIsNotUrl({ text }));

      if (!textToNodes[text]) {
        textToNodes[text] = [];
      }
      textToNodes[text].push(node);
    };

    visit(tree, "link", aggregate);

    if (config["unique"]) {
      for (const text of Object.keys(textToNodes)) {
        const nodes = textToNodes[text];
        const notes = checkUniqueLinkText({ nodes, text });
        if (notes) file.message(notes, nodes[0]);
      }
    }
  }
);

export default checkLinkText;

export type TextNode = {
  type: "text" | "image";
  title: string | null;
  url?: string;
  alt?: string;
  value: string | undefined;
  position: number[];
  children: TextNode[];
};
