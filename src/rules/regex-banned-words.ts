import { VFile } from "unified-lint-rule/lib";
import { TextNode } from "../index.js";
import { createMessage } from "./banned-words.js";
import banned from "../banned.js";

export default function checkRegexBannedWords({
  file,
  node,
  text,
}: {
  file: VFile;
  node: TextNode;
  text: string;
}) {
  for (const start of starts) {
    if (!text.toLowerCase().startsWith(start)) continue;
    for (const regex of bannedRegex) {
      if (new RegExp(`${regex}`, "i").test(text)) {
        createMessage({ file, node, text });
      }
    }
  }
}

export const starts = ["this", "the"];
export const bannedRegex = banned.reduce((arr: string[], b: string) => {
  for (const s of starts) {
    const trimmed = b.replace(s, "").trim();
    if (b.startsWith(s) && !arr.includes(trimmed))
      arr.push(`${s}\\s(.*?)\\s${trimmed}\\b$`);
  }
  return arr;
}, []);
