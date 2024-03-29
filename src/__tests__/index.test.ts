import { remark } from "remark";
import dedent from "dedent";
import plugin from "../";

const processMarkdown = (markdown: string, opts?) => {
  return remark().use(plugin, opts).process(markdown);
};

describe("remark-lint-link-text", () => {
  test("no errors when no links present", async () => {
    const lint = await processMarkdown(dedent`
      # Title

      No URLs in here.
    `);
    expect(lint.messages.length).toEqual(0);
  });

  test("works, random test cases", async () => {
    const lint = await processMarkdown(dedent`
1. [Bullet item](https://example.com) 

A [\`code\`](https://example.com) and [\`another code\`](https://example.com) 

- [**clues.js**](https://github.com/double-great/alt-text/blob/main/clues.js)
    `);
    expect(lint.messages.length).toEqual(0);
  });

  test("warns against banned link text", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A good link: Visit [Example’s website](https://example.com) for more information.

      A bad link: [click here](https://example.com).

      A bad link: [link](https://example.com)
    `,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [5:13-5:46: Avoid using the link text “click here,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
        [7:13-7:40: Avoid using the link text “link,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
      ]
    `);
  });

  test("warns against banned link text, case insensitve", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A bad link: [Click here](https://example.com).
    `,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [3:13-3:46: Avoid using the link text “Click here,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
      ]
    `);
  });

  test("warns against url as link text", async () => {
    const lint = await processMarkdown(
      dedent`A bad link: [https://example.com/initiatives/business/papers/important-ones.htm](https://example.com/initiatives/business/papers/important-ones.htm).`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [1:13-1:149: Avoid using a URL “https://example.com/initiatives/business/papers/important-ones.htm” as the link text. Consider users who must speak it out loud and who must listen to a screen reader announce it. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-a-url)],
      ]
    `);
  });

  test("warns against url as link text, config, disabled", async () => {
    const lint = await processMarkdown(
      dedent`A bad link: [https://example.com/initiatives/business/papers/important-ones.htm](https://example.com/initiatives/business/papers/important-ones.htm).`,
      { "not-url": false },
    );
    expect(lint.messages).toMatchInlineSnapshot(`[]`);
  });

  test("the...documentation should pass", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A good link: [important business papers](https://example.com/initiatives/business/papers/important-ones.htm).
    `,
    );
    expect(lint.messages.length).toEqual(0);
  });

  test("should pass", async () => {
    const lint = await processMarkdown(
      dedent`
      ## Example 1
      
      In this example we link to [important business papers](https://example.com/initiatives/business/papers/important-ones.htm) for more information.
    `,
    );
    expect(lint.messages.length).toEqual(0);
  });

  test("unique link text", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [staff directory](https://example.com/about-us/) to learn more. You can visit the other [staff directory](https://example.com/team/directory/) to learn other stuff.`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [1:11-1:59: The link text “staff directory” is used more than once with different URLs. Change the link text to be unique to the URL. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-unique)],
      ]
    `);
  });

  test("unique link text, config. disabled", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [staff directory](https://example.com/about-us/) to learn more. You can visit the other [staff directory](https://example.com/team/directory/) to learn other stuff.`,
      { unique: false },
    );
    expect(lint.messages).toMatchInlineSnapshot(`[]`);
  });

  test("link with image", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [staff directory ![](example.png)](https://example.com).`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`[]`);
  });

  test("link is image, no alt text", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [![](example.png)](https://example.com).`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [1:11-1:50: The link “https://example.com” must have link text or the image inside the link must have alt text (https://doublegreat.dev/remark-lint-link-text/#linked-image-is-missing-alt-text)],
      ]
    `);
  });

  test("link is image, no alt text, config, disabled", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [![](example.png)](https://example.com).`,
      { "empty-alt-text": false },
    );
    expect(lint.messages).toMatchInlineSnapshot(`[]`);
  });

  test("link is image, alt text", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [![staff directory](example.png)](https://example.com).`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`[]`);
  });

  test("missing link text", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [](https://example.com).`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [1:11-1:34: The link “https://example.com” must have link text (https://doublegreat.dev/remark-lint-link-text/#link-text-is-missing)],
      ]
    `);
  });

  test("email address", async () => {
    const lint = await processMarkdown(
      dedent`
      Bad: [Email me](mailto:email@example.com)
      Good: [otheremail@example.com](mailto:otheremail@example.com?subject=hey)
      Good: [email@example.com](mailto:email@example.com)
    `,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [1:6-1:42: Text must include email “email@example.com” because the link URL will generate an email message (https://doublegreat.dev/remark-lint-link-text/#link-to-email-does-not-contain-email-address-in-link-text)],
      ]
    `);
  });

  test("warns against banned link text, regex match", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A bad link: [this example article](https://example.com).
      A bad link: [this article](https://example.com).
      A bad link: [click here](https://example.com).
      A bad link: [this blog post](https://example.com).
      A bad link: [the example blog post](https://example.com).
    `,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [3:13-3:56: Avoid using the link text “this example article,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
        [4:13-4:48: Avoid using the link text “this article,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
        [5:13-5:46: Avoid using the link text “click here,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
        [6:13-6:50: Avoid using the link text “this blog post,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
        [7:13-7:57: Avoid using the link text “the example blog post,” it can be confusing when a screen reader reads it out of context. Replace it with a short description of the link’s destination. (https://doublegreat.dev/remark-lint-link-text/#link-text-is-not-descriptive)],
      ]
    `);
  });

  test("empty", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [](https://example.com).`,
    );
    expect(lint.messages).toMatchInlineSnapshot(`
      [
        [1:11-1:34: The link “https://example.com” must have link text (https://doublegreat.dev/remark-lint-link-text/#link-text-is-missing)],
      ]
    `);
  });
  test("empty, config, disabled", async () => {
    const lint = await processMarkdown(
      dedent`Visit the [](https://example.com).`,
      { empty: false },
    );
    expect(lint.messages).toMatchInlineSnapshot(`[]`);
  });
});
