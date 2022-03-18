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

  test("warns against banned link text", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A good link: Visit [Mapbox Documentation](https://docs.mapbox.com) for more infomration.

      A bad link: [click here](https://docs.mapbox.com).

      A bad link: [link](https://google.com)
    `
    );

    expect(lint.messages.length).toEqual(2);
    expect(lint.messages).toMatchInlineSnapshot(`
      Array [
        [5:13-5:50: Replace "click here" with descriptive link text that details the destination.],
        [7:13-7:39: Replace "link" with descriptive link text that details the destination.],
      ]
    `);
  });

  test("warns against banned link text, case insensitve", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A bad link: [Click here](https://docs.mapbox.com).
    `
    );

    expect(lint.messages.length).toEqual(1);
    expect(lint.messages[0].reason).toMatchInlineSnapshot(
      `"Replace \\"Click here\\" with descriptive link text that details the destination."`
    );
  });

  test("the...documentation should pass", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A good link: [the Mapbox Isochrone API documentation](https://docs.mapbox.com).
    `
    );

    expect(lint.messages.length).toEqual(0);
  });

  test("should pass", async () => {
    const lint = await processMarkdown(
      dedent`
      ## Option 1: Choropleth
      
      In this option, we will create a choropleth visualization using data from [The Washington Post's "2ºC: Beyond the Limit" series about rising temperatures](https://github.com/washingtonpost/data-2C-beyond-the-limit-usa), which analyzes warming temperatures in the United States.
    `
    );
    expect(lint.messages.length).toEqual(0);
  });

  test("warns against banned link text, regex match", async () => {
    const lint = await processMarkdown(
      dedent`
      # Title

      A bad link: [this mapbox article](https://docs.mapbox.com).
      A bad link: [this Mapbox article](https://docs.mapbox.com).
      A bad link: [this article](https://docs.mapbox.com).
      A bad link: [this blog post](https://docs.mapbox.com).
      A bad link: [the Mapbox blog post](https://docs.mapbox.com).
    `
    );

    expect(lint.messages.length).toEqual(5);
    expect(lint.messages[0].reason).toMatchInlineSnapshot(
      `"Replace \\"this mapbox article\\" with descriptive link text that details the destination."`
    );
    expect(lint.messages[1].reason).toMatchInlineSnapshot(
      `"Replace \\"this Mapbox article\\" with descriptive link text that details the destination."`
    );
    expect(lint.messages[2].reason).toMatchInlineSnapshot(
      `"Replace \\"this article\\" with descriptive link text that details the destination."`
    );
    expect(lint.messages[3].reason).toMatchInlineSnapshot(
      `"Replace \\"this blog post\\" with descriptive link text that details the destination."`
    );
    expect(lint.messages[4].reason).toMatchInlineSnapshot(
      `"Replace \\"the Mapbox blog post\\" with descriptive link text that details the destination."`
    );
  });
});
