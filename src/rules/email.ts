import { TextNode } from "../index.js";

export default function checkEmail({
  node,
  text,
}: {
  node: TextNode;
  text: string;
}) {
  const { url } = node;
  if (!url || !url.startsWith("mailto:")) return;
  // check the `text` to see if it has the email.
  // create var with just the email.
  const email = url.replace("mailto:", "");
  if (text.includes(email)) {
    return "Text must include email";
  }
}
