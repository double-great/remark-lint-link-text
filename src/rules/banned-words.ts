import banned from "../banned.js";

export default function checkBannedWords({ text }: { text: string }) {
  if (banned.includes(text.toLowerCase())) {
    return `Avoid using the link text “${text},” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination.`;
  }
}
