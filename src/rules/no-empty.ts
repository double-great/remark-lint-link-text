import { TextNode } from "../index.js";

export default function checkIsNotEmpty({
  node,
  text,
  altText,
  hasImage,
}: {
  node: TextNode;
  text: string;
  altText: string;
  hasImage: boolean;
}) {
  if (!text && !altText && !hasImage) {
    return `The link “${node.url}” must have link text`;
  }
}
