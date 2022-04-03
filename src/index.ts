import { lintRule } from "unified-lint-rule";
import { VFile, Node } from "unified-lint-rule/lib";
import { visit } from "unist-util-visit";
import checkIsNotEmptyNoAlt from "./rules/not-empty-no-alt.js";
import checkIsNotEmpty from "./rules/no-empty.js";
import checkRegexBannedWords from "./rules/regex-banned-words.js";
import checkBannedWords from "./rules/banned-words.js";
import checkIsNotUrl from "./rules/not-url.js";
import checkUniqueLinkText from "./rules/unique.js";

const checkLinkText = lintRule(
  "remark-lint:link-text",
  (tree: Node, file: VFile): void => {
    const textToNodes: { [text: string]: TextNode[] } = {};

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

      message(checkIsNotEmpty.check({ node, text, altText, hasImage }));
      message(checkIsNotEmptyNoAlt.check({ node, text, altText, hasImage }));
      message(checkRegexBannedWords.check({ text }));
      message(checkBannedWords.check({ text }));
      message(checkIsNotUrl.check({ text }));

      if (!textToNodes[text]) {
        textToNodes[text] = [];
      }
      textToNodes[text].push(node);
    };

    visit(tree, "link", aggregate);

    for (const text of Object.keys(textToNodes)) {
      const nodes = textToNodes[text];
      const notes = checkUniqueLinkText.check({ text, nodes });
      if (notes) file.message(notes, nodes[0]);
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
