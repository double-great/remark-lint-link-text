import emptyNoAlt from "../empty-no-alt";
import checkDocsLink from "../utils.js";

describe("Linked image is missing alt text", () => {
  it("document", () => {
    expect(emptyNoAlt.document()).toMatchInlineSnapshot(`
      "### Linked image is missing alt text

      When an image is the only content in a link, alt text is required. In this context, missing alt text is a [failure of WCAG 2.4.4 (A), 2.4.9 (AAA), and 4.1.2 (A)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F89).

      🚫 The following markdown will cause a warning:

      \`\`\`md
      [![](https://example.com/logo.svg)](https://example.com)
      \`\`\`

      ✅ The following markdown will _not_ cause a warning:

      \`\`\`md
      [![Example logo](https://example.com/logo.svg)](https://example.com)
      \`\`\`

      💡 When an image is the only content in a link, the image’s alt text effectively becomes the link text. Based on [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context), the alt text should describle the function of the link (instead of describing the image).
      "
    `);
  });
  it("check", () => {
    expect(
      emptyNoAlt.check({
        node: { url: "my-image.jpg" },
        text: undefined,
        altText: undefined,
        hasImage: true,
      })
    ).toMatchInlineSnapshot(
      `"The link “my-image.jpg” must have link text or the image inside the link must have alt text (https://tinyurl.com/ycg5glhn)"`
    );
    expect(
      emptyNoAlt.check({
        node: { url: "my-image.jpg" },
        text: "",
        altText: "My alt text",
        hasImage: true,
      })
    ).toMatchInlineSnapshot(`undefined`);
  });
  it("`docs` matches generated GitHub `heading` link", async () => {
    expect.assertions(1);
    await expect(checkDocsLink(emptyNoAlt.heading)).resolves.toEqual(
      emptyNoAlt.docs
    );
  });
});
