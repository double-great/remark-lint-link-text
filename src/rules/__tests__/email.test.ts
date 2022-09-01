import checkEmail from "../email";
import checkDocsLink from "../utils.js";

describe("Link to email does not contain email address in link text", () => {
  it("document", () => {
    expect(checkEmail.document()).toMatchInlineSnapshot(`
      "### Link to email does not contain email address in link text

      When linking to an email address, using \`mailto:\`, the email address should be in the link text. This provides users with context for what will happen when interacting with the link (a new email message will open in email application). Also, email in the link text is useful context when the link can’t be activated (plain text paste, printed page).

      🚫 The following markdown will cause a warning:

      \`\`\`md
      [Email me](mailto:email@example.com)
      \`\`\`

      ✅ The following markdown will _not_ cause a warning:

      \`\`\`md
      [email@example.com](mailto:email@example.com)
      \`\`\`

      \`\`\`md
      [otheremail@example.com](mailto:otheremail@example.com?subject=hello)
      \`\`\`

      Configuration:

      <!-- prettier-ignore-start -->
      \`\`\`js
      // disable the rule:
      ["@double-great/remark-lint-link-text", [1, {"email":false}]]
      \`\`\`
      <!-- prettier-ignore-end -->
      "
    `);
  });
  it("check", () => {
    expect(
      checkEmail.check({
        text: "email me",
        node: { url: "mailto:email@example.com" },
      })
    ).toMatchInlineSnapshot(
      `"Text must include email “email@example.com” because the link URL will generate an email message (https://doublegreat.dev/remark-lint-link-text/#link-to-email-does-not-contain-email-address-in-link-text)"`
    );
    expect(
      checkEmail.check({
        text: "email@example.com",
        node: { url: "mailto:email@example.com" },
      })
    ).toMatchInlineSnapshot(`undefined`);
  });
  it("`docs` matches generated GitHub `heading` link", async () => {
    expect.assertions(1);
    await expect(checkDocsLink(checkEmail.heading)).resolves.toEqual(
      checkEmail.docs
    );
  });
});
