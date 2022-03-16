import { lintRule } from "unified-lint-rule";
import { VFile, Node } from "unified-lint-rule/lib";
import { visit } from "unist-util-visit";
import banned from "./banned.json";

const starts = ["this", "the"];
const bannedRegex = banned.reduce((arr: string[], b: string) => {
  starts.forEach((s) => {
    const trimmed = b.replace(s, "").trim();
    if (b.startsWith(s) && arr.indexOf(trimmed) === -1)
      arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
  });
  return arr;
}, []);

type textNode = {
  type: string;
  title: string | null;
  url: string;
  value: string | undefined;
  position: string[];
  children: textNode[];
};

const checkLinkText = lintRule(
  "remark-lint:link-text",
  (tree: Node, file: VFile): void => {
    const textToNodes: { [text: string]: textNode[] } = {};

    const aggregate = (node: textNode) => {
      const text = node.children.reduce((str, arr) => {
        if (arr.type == "text") str += arr.value;
        return str;
      }, "");

      if (!text) return;

      if (!textToNodes[text]) {
        textToNodes[text] = [];
      }

      textToNodes[text].push(node);
    };

    visit(tree, "link", aggregate);

    for (const txt of Object.keys(textToNodes)) {
      const nodes = textToNodes[txt];
      if (!nodes) return;

      // test regex
      starts.forEach((start) => {
        if (txt.toLowerCase().startsWith(start)) {
          bannedRegex.forEach((reg) => {
            if (new RegExp(`${reg}`, "i").test(txt)) {
              for (const node of nodes) {
                file.message(
                  `Replace "${txt}" with descriptive link text that details the destination.`,
                  node
                );
              }
            }
          });
        }
      });

      // test banned words
      if (banned.includes(txt.toLowerCase())) {
        for (const node of nodes) {
          file.message(
            `Replace "${txt}" with descriptive link text that details the destination.`,
            node
          );
        }
      }
    }
  }
);

export default checkLinkText;
