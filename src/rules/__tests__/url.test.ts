import url from "../url";
import checkDocsLink from "../utils.js";

describe("Link text is a URL", () => {
  it("document", () => {
    expect(url.document()).toMatchInlineSnapshot(`
      "### Link text is a URL

      [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context) considers a link containing text that gives a description of the information at that URL a sufficient technique. When a URL is the link text, screen readers have to listen while the reader pronounces every single character of a URL. Audibly, this is less descriptive and more time consuming to listen to than descriptive link text. [WebAIM’s Links and Hypertext page](https://webaim.org/techniques/hypertext/link_text) explains the challenges of [URLs as links](https://webaim.org/techniques/hypertext/link_text#urls).

      🚫 The following markdown will cause a warning:

      \`\`\`md
      [https://www.w3c.org/WAI/fundamentals/accessibility-intro/](https://www.w3c.org/WAI/fundamentals/accessibility-intro/)
      \`\`\`

      When read aloud, users will hear “h t t p s colon slash slash w w w dot w 3 c dot org slash w a i slash fundementals slash accessibility dash intro slash, link”.

      ✅ The following markdown will _not_ cause a warning:

      \`\`\`md
      [Introduction to Web Accessibility](https://www.w3c.org/WAI/fundamentals/accessibility-intro/)
      \`\`\`

      When read aloud, users will hear “Introduction to Web Accessibility, link”.

      Configuration:

      \`\`\`js
      // disable the rule:
      [\\"@double-great/remark-lint-link-text\\", [1, { url: false }]];
      \`\`\`

      💡 This check is at odds with some stylistic guidelines, like APA. The [APA Style’s Accessible URLs page](https://apastyle.apa.org/style-grammar-guidelines/paper-format/accessibility/urls) provides some rationale for their guidelines as it relates to [WCAG 2.4.4](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context).
      "
    `);
  });
  it("check", () => {
    expect(
      url.check({
        text: "https://www.website.org",
      })
    ).toMatchInlineSnapshot(
      `"Avoid using a URL “https://www.website.org” as the link text. Consider users who must speak it out loud and who must listen to a screen reader announce it. Replace it with a short description of the link’s destination. (https://tinyurl.com/yadzyhe5)"`
    );
    expect(
      url.check({
        text: "Staff directory",
      })
    ).toMatchInlineSnapshot(`undefined`);
  });
  it("`docs` matches generated GitHub `heading` link", async () => {
    expect.assertions(1);
    await expect(checkDocsLink(url.heading)).resolves.toEqual(url.docs);
  });
});
