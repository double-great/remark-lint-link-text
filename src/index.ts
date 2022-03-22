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

      checkIsNotEmpty({ file, node, text, altText, hasImage });
      checkIsNotEmptyNoAlt({ file, node, text, altText, hasImage });
      checkRegexBannedWords({ file, node, text });
      checkBannedWords({ file, node, text });
      checkIsNotUrl({ file, node, text });

      if (!textToNodes[text]) {
        textToNodes[text] = [];
      }
      textToNodes[text].push(node);
    };

    visit(tree, "link", aggregate);

    for (const text of Object.keys(textToNodes)) {
      const nodes = textToNodes[text];
      checkUniqueLinkText({ file, nodes, text });
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
