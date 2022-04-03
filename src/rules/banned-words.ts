import banned from "../banned.js";
import { Config } from "../index.js";

export default function checkBannedWords({
  text,
  config,
}: {
  text: string;
  config: Config;
}) {
  const disallowList = Array.isArray(config["banned-words"])
    ? config["banned-words"]
    : banned;
  if (disallowList.includes(text.toLowerCase())) {
    return `Avoid using the link text “${text},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`;
  }
}
