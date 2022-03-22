import { VFile } from "unified-lint-rule/lib";
import { TextNode } from "../index.js";

export default function checkIsNotEmpty({
  file,
  node,
  text,
  altText,
  hasImage,
}: {
  file: VFile;
  node: TextNode;
  text: string;
  altText: string;
  hasImage: boolean;
}) {
  if (!text && !altText && !hasImage) {
    file.message(`The link “${node.url}” must have link text`, node);
    return;
  }
}
