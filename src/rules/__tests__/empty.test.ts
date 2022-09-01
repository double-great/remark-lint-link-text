import empty from "../empty";
import checkDocsLink from "../utils.js";

describe("Link text is missing", () => {
  it("document", () => {
    expect(empty.document()).toMatchInlineSnapshot(`
      "### Link text is missing

      In markdown, missing link text is often an oversight. Although an [\`<a>\` element without a \`href\` attribute is valid](https://html.spec.whatwg.org/#the-a-element) HTML, [WebAIM suggests that empty links can be very confusing](https://webaim.org/techniques/hypertext/link_text#empty_links) to keyboard and screen reader users and should be avoided completely.

      🚫 The following markdown will cause a warning:

      \`\`\`md
      [](https://example.com)
      \`\`\`

      ✅ The following markdown will _not_ cause a warning:

      \`\`\`md
      [Example](https://example.com)
      \`\`\`

      Configuration:

      <!-- prettier-ignore-start -->
      \`\`\`js
      // disable the rule:
      ["@double-great/remark-lint-link-text", [1, {"empty":false}]]
      \`\`\`
      <!-- prettier-ignore-end -->
      "
    `);
  });
  it("check", () => {
    expect(
      empty.check({
        node: { url: "my-image.jpg" },
        text: undefined,
        altText: undefined,
        hasImage: false,
      })
    ).toMatchInlineSnapshot(
      `"The link “my-image.jpg” must have link text (https://doublegreat.dev/remark-lint-link-text/#link-text-is-missing)"`
    );
    expect(
      empty.check({
        node: { url: "my-image.jpg" },
        text: "My image",
        altText: undefined,
        hasImage: false,
      })
    ).toMatchInlineSnapshot(`undefined`);
  });
  it("`docs` matches generated GitHub `heading` link", async () => {
    expect.assertions(1);
    await expect(checkDocsLink(empty.heading)).resolves.toEqual(empty.docs);
  });
});
