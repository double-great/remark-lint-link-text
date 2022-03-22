import { VFile } from "unified-lint-rule/lib";
import { TextNode } from "../index.js";

export default function checkIsNotUrl({
  file,
  node,
  text,
}: {
  file: VFile;
  node: TextNode;
  text: string;
}) {
  if (
    text.match(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    )
  ) {
    file.message(
      `Avoid using a URL “${text}” as the link text. Consider users who must speak it out loud and who must listen to a screen reader announce it. Replace it with a short description of the link’s destination.`,
      node
    );
  }
}
