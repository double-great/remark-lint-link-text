import GithubSlugger from "github-slugger";

const slugger = new GithubSlugger();

export default async function checkDocsLink(heading: string) {
  return `https://doublegreat.dev/remark-lint-link-text/#${slugger.slug(
    heading,
  )}`;
}
