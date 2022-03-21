import { lintRule } from "unified-lint-rule";
import { VFile, Node } from "unified-lint-rule/lib";
import { visit } from "unist-util-visit";
import banned from "./banned.js";

const checkLinkText = lintRule(
  "remark-lint:link-text",
  (tree: Node, file: VFile): void => {
    const textToNodes: { [text: string]: ItemNode[] } = {};
    const aggregate = (node: ItemNode) => {
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

      if (!text && !altText && !hasImage) {
        file.message(`The link “${node.url}” must have link text`, node);
        return;
      }

      if (!text && !altText && hasImage) {
        file.message(
          `The link “${node.url}” must have link text or the image inside the link must have alt text`,
          node
        );
        return;
      }

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
      checkRegexBannedWords(file, nodes, txt);

      // test banned words
      checkBannedWords(file, nodes, txt);

      checkIsNotUrl(file, nodes, txt);

      checkUniqueLinkText(file, nodes, txt);
    }
  }
);

export default checkLinkText;

function checkRegexBannedWords(file: VFile, nodes: ItemNode[], text: string) {
  for (const start of starts) {
    if (!text.toLowerCase().startsWith(start)) continue;
    for (const regex of bannedRegex) {
      if (new RegExp(`${regex}`, "i").test(text)) {
        for (const node of nodes) {
          createMessage(file, node, text);
        }
      }
    }
  }
}

function checkBannedWords(file: VFile, nodes: ItemNode[], text: string) {
  if (banned.includes(text.toLowerCase())) {
    for (const node of nodes) {
      createMessage(file, node, text);
    }
  }
}

function checkIsNotUrl(file: VFile, nodes: ItemNode[], text: string) {
  if (
    text.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    )
  ) {
    for (const node of nodes) {
      file.message(
        `Avoid using a URL “${text}” as the link text. Consider users who must speak it out loud and who must listen to a screen reader announce it. Replace it with a short description of the link’s destination.`,
        node
      );
    }
  }
}

function checkUniqueLinkText(file: VFile, nodes: ItemNode[], text: string) {
  const uniqueUrls = [...new Set(nodes.map(({ url }) => url))];
  if (uniqueUrls.length > 1) {
    for (const node of nodes) {
      file.message(
        `The link text “${text}” is used more than once with different URLs. Change the link text to be unique to the URL.`,
        node
      );
    }
  }
}

function createMessage(file: VFile, node: ItemNode, text: string) {
  file.message(
    `Avoid using the link text “${text},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`,
    node
  );
}

type ItemNode = {
  type: "text" | "image";
  title: string | null;
  url?: string;
  alt?: string;
  value: string | undefined;
  position: number[];
  children: ItemNode[];
};

const starts = ["this", "the"];
const bannedRegex = banned.reduce((arr: string[], b: string) => {
  for (const s of starts) {
    const trimmed = b.replace(s, "").trim();
    if (b.startsWith(s) && !arr.includes(trimmed))
      arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
  }
  return arr;
}, []);
