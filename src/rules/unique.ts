import { TextNode } from "../index.js";

export default function checkUniqueLinkText({
  nodes,
  text,
}: {
  nodes: TextNode[];
  text: string;
}) {
  const uniqueUrls = [...new Set(nodes.map(({ url }) => url))];
  if (uniqueUrls.length > 1) {
    return `The link text “${text}” is used more than once with different URLs. Change the link text to be unique to the URL.`;
  }
}
