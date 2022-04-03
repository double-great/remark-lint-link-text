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
  const emailArray = url.split("?");
  const email = emailArray[0].replace("mailto:", "");
  if (!text.includes(email)) {
    return `Text must include email “${email}” because the link URL will generate an email message`;
  }
}
