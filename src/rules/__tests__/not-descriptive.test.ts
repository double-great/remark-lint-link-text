import descriptive from "../not-descriptive";
import checkDocsLink from "../utils.js";

describe("Link text is not descriptive", () => {
  it("document", () => {
    expect(descriptive.document()).toMatchInlineSnapshot(`
      "### Link text is not descriptive

      Pulling from this library’s list of bad link text, any link text that matches this list will be flagged. Using non-specific link text is a [failure of WCAG 2.4.9 (AAA)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F84.html).

      🚫 The following markdown will cause a warning:

      \`\`\`md
      - [click here](https://example.com/team)
      \`\`\`

      ✅ The following markdown will _not_ cause a warning:

      \`\`\`md
      - [Example team](https://example.com/team)
      \`\`\`

      Configuration:

      <!-- prettier-ignore-start -->
      \`\`\`js
      // disable the rule:
      ["@double-great/remark-lint-link-text", [1, {"not-descriptive":false}]]
      // adjust rule defaults:
      ["@double-great/remark-lint-link-text", [1, {"not-descriptive":["about","button","can be found here","click","click here","continue","continue reading","details","email","figure","found here","here","learn more","link","more","more details","more here","online","read more","resource","the article","the document","the entry","the link","the page","the post","the site","the website","this article","this document","this entry","this link","this page","this post","this site","this website","url","website"]}]]
      \`\`\`
      <!-- prettier-ignore-end -->

      💡 For all banned phrases that begin with \`this\` or \`the\`, any words that come between will also fail. For example “this post”, “this W3C post”, and “this W3C blog post” will all fail.
      "
    `);
  });
  it("check", () => {
    expect(
      descriptive.check({
        text: "click here",
      }),
    ).toMatchInlineSnapshot(
      `"Avoid using the link text “click here,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)"`,
    );
    expect(
      descriptive.check({
        text: "this cool article",
      }),
    ).toMatchInlineSnapshot(
      `"Avoid using the link text “this cool article,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)"`,
    );
    expect(
      descriptive.check({
        text: "Staff directory",
      }),
    ).toMatchInlineSnapshot(`undefined`);
    expect(
      descriptive.check({
        text: "click here",
        config: ["more here"],
      }),
    ).toMatchInlineSnapshot(`undefined`);
    expect(
      descriptive.check({
        text: "this cool article",
        config: ["more here"],
      }),
    ).toMatchInlineSnapshot(`undefined`);
  });
  it("`docs` matches generated GitHub `heading` link", async () => {
    expect.assertions(1);
    await expect(checkDocsLink(descriptive.heading)).resolves.toEqual(
      descriptive.docs,
    );
  });
});
