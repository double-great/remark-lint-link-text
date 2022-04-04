import { readFile, writeFile } from "fs/promises";
import checkUniqueLinkText from "./rules/unique.js";
import checkIsNotUrl from "./rules/url.js";
import checkEmail from "./rules/email.js";
import checkIsNotEmptyNoAlt from "./rules/empty-no-alt.js";
import checkIsNotEmpty from "./rules/empty.js";
import checkNotDescriptive from "./rules/not-descriptive.js";

import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();

const allClues = [
  checkNotDescriptive,
  checkUniqueLinkText,
  checkIsNotUrl,
  checkIsNotEmpty,
  checkIsNotEmptyNoAlt,
  checkEmail,
];

export const formattedDocs = `## List of warnings

<!-- generated content -->

${allClues
  .map(
    (clue) =>
      `- [${clue.heading} (\`${clue.id}\`)](#${slugger.slug(clue.heading)})`
  )
  .join("\n")}

${allClues.map((clue) => clue.document()).join("\n")}
<!-- end generated content -->`;

export async function writeDocs() {
  const { currentDocs, matchedDocs } = await swapDocs();
  if (!matchedDocs) return;
  const newFile = currentDocs.replace(matchedDocs[0], formattedDocs);
  try {
    await writeFile("README.md", newFile);
  } catch (error) {
    console.log(error);
  }
}

export async function swapDocs() {
  const readme = await readFile("./README.md", "utf-8");
  return {
    currentDocs: readme,
    matchedDocs: readme.match(
      /## List of warnings([\s\S]*)\n<!-- end generated content -->/g
    ),
  };
}

writeDocs();
