import unique from "../unique";
import checkDocsLink from "../utils.js";

describe("Link text is not unique", () => {
  it("document", () => {
    expect(unique.document()).toMatchInlineSnapshot(`
      "### Link text is not unique

      This warning relates to [WCAG 2.4.9 Link Purpose (Link Only) (AAA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=249#link-purpose-link-only) and [WCAG 3.2.4 Consistent Navigation (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=324#consistent-identification). Links with different purposes and destinations should have different link text. Descriptive link text communicates a link’s purpose even when the context is missing. A screen reader listing all of the links on a page is an example where the context would be missing.

      🚫 The following markdown will cause a warning:

      \`\`\`md
      - [Example](https://example.com/team)
      - [Example](https://example.com/about)
      \`\`\`

      ✅ The following markdown will _not_ cause a warning:

      \`\`\`md
      - [Example team](https://example.com/team)
      - [About Example](https://example.com/about)
      \`\`\`

      Configuration:

      <!-- prettier-ignore-start -->
      \`\`\`js
      // disable the rule:
      ["@double-great/remark-lint-link-text", [1, {"unique":false}]]
      \`\`\`
      <!-- prettier-ignore-end -->

      💡 This check does not account for techniques that use \`aria-label\` or \`aria-labelledby\` attributes to provide additional link context. Context provided by content that surrounds the link, as allowed by [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context), is not considered by this check.
      "
    `);
  });
  it("check", () => {
    expect(
      unique.check({
        text: "Staff directory",
        nodes: [{ url: "www.directory.com" }, { url: "www.my-directory.com" }],
      }),
    ).toMatchInlineSnapshot(
      `"The link text “Staff directory” is used more than once with different URLs. Change the link text to be unique to the URL. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-unique)"`,
    );
    expect(
      unique.check({
        text: "Staff directory",
        nodes: [{ url: "www.directory.com" }, { url: "www.directory.com" }],
      }),
    ).toMatchInlineSnapshot(`undefined`);
  });
  it("`docs` matches generated GitHub `heading` link", async () => {
    expect.assertions(1);
    await expect(checkDocsLink(unique.heading)).resolves.toEqual(unique.docs);
  });
});
