import { VFile } from "unified-lint-rule/lib";
import banned from "../banned.js";
import { TextNode } from "../index.js";

export default function checkBannedWords({
  file,
  node,
  text,
}: {
  file: VFile;
  node: TextNode;
  text: string;
}) {
  if (banned.includes(text.toLowerCase())) {
    createMessage({ file, node, text });
  }
}

export function createMessage({
  file,
  node,
  text,
}: {
  file: VFile;
  node: TextNode;
  text: string;
}) {
  file.message(
    `Avoid using the link text “${text},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`,
    node
  );
}
