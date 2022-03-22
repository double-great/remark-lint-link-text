import { VFile } from "unified-lint-rule/lib";
import { TextNode } from "../index.js";

export default function checkUniqueLinkText({
  file,
  nodes,
  text,
}: {
  file: VFile;
  nodes: TextNode[];
  text: string;
}) {
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
