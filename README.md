# remark-lint-link-text

A [remark-lint](https://github.com/remarkjs/remark-lint) plugin that warns against non-descriptive link text.

```md
✅ Check out [W3C’s Web Accessibility Initiative](https://www.w3.org/WAI) to learn more.
🚫 Learn more [here](https://www.w3.org/WAI).
```

## Installation and usage

```shell
npm install --save-dev remark-cli @double-great/remark-lint-link-text
```

Add the plugin to your remark configuration:

```json
"remarkConfig": {
  "plugins": [
    "@double-great/remark-lint-link-text"
  ]
},
```

## List of warnings

### Link text is not descriptive

Pulling from [this library’s list of bad link text](src/banned.ts), any link text that matches this list will be flagged. Using non-specific link text is a [failure of WCAG 2.4.9 (AAA)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F84.html).

Here’s a sample of the phrases in [`src/banned.ts`](src/banned.ts):

- click here
- read more
- learn more
- website
- found here
- this article

🚫 The following markdown will cause a warning:

```md
- [click here](https://example.com/team)
```

✅ The following markdown will _not_ cause a warning:

```md
- [Example team](https://example.com/team)
```

💡 For all banned phrases that begin with `this` or `the`, any words that come between will also fail. For example "this post", "this W3C post", and "this W3C blog post" will all fail.

### Link text is not unique

This warning relates to [WCAG 2.4.9 Link Purpose (Link Only) (AAA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=249#link-purpose-link-only) and [WCAG 3.2.4 Consistent Navigation (AA)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=324#consistent-identification). Links with different purposes and destinations should have different link text. Descriptive link text communicates a link's purpose even when the context is missing. A screen reader listing all of the links on a page is an example where the context would be missing.

🚫 The following markdown will cause a warning:

```md
- [Example](https://example.com/team)
- [Example](https://example.com/about)
```

✅ The following markdown will _not_ cause a warning:

```md
- [Example team](https://example.com/team)
- [About Example](https://example.com/about)
```

💡 This check does not account for techniques that use `aria-label` or `aria-labelledby` attributes to provide additional link context. Context provided by content that surrounds the link, as allowed by [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context), is not considered by this check.

### Link text is a URL

[WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context) considers a link containing text that gives a description of the information at that URL a sufficient technique. When a URL is the link text, screen readers have to listen while the reader pronounces every single character of a URL. Audibly, this is less descriptive and more time consuming to listen to than descriptive link text. [WebAIM's Links and Hypertext page](https://webaim.org/techniques/hypertext/link_text) explains the challenges of [URLs as links](https://webaim.org/techniques/hypertext/link_text#urls).

🚫 The following markdown will cause a warning:

```md
[https://www.w3c.org/WAI/fundamentals/accessibility-intro/](https://www.w3c.org/WAI/fundamentals/accessibility-intro/)
```

When read aloud, users will hear "h t t p s colon slash slash w w w dot w 3 c dot org slash w a i slash fundementals slash accessibility dash intro slash, link".

✅ The following markdown will _not_ cause a warning:

```md
[Introduction to Web Accessibility](https://www.w3c.org/WAI/fundamentals/accessibility-intro/)
```

When read aloud, users will hear "Introduction to Web Accessibility, link".

💡 This check is at odds with some stylistic guidelines, like APA. The [APA Style’s Accessible URLs page](https://apastyle.apa.org/style-grammar-guidelines/paper-format/accessibility/urls) provides some rationale for their guidelines as it relates to [WCAG 2.4.4](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context).

### Link text is missing

In markdown, missing link text is often an oversight. Although an [`<a>` element without a `href` attribute is valid](https://html.spec.whatwg.org/#the-a-element) HTML, [WebAIM suggests that empty links can be very confusing](https://webaim.org/techniques/hypertext/link_text#empty_links) to keyboard and screen reader users and should be avoided completely.

🚫 The following markdown will cause a warning:

```md
[](https://example.com)
```

✅ The following markdown will _not_ cause a warning:

```md
[Example](https://example.com)
```

### Linked image is missing alt text

When an image is the only content in a link, alt text is required. In this context, missing alt text is a [failure of WCAG 2.4.4 (A), 2.4.9 (AAA), and 4.1.2 (A)](https://www.w3.org/WAI/WCAG21/Techniques/failures/F89).

🚫 The following markdown will cause a warning:

```md
[![](https://example.com/logo.svg)](https://example.com)
```

✅ The following markdown will _not_ cause a warning:

```md
[![Example logo](https://example.com/logo.svg)](https://example.com)
```

💡 When an image is the only content in a link, the image's alt text effectively becomes the link text. Based on [WCAG 2.4.4 Link Purpose (In Context) (A)](https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=244#link-purpose-in-context), the alt text should describle the function of the link (instead of describing the image).

### Link to email does not contain email address in link text

When linking to an email address, using `mailto:`, the email address should be in the link text. This provides users with context for what will happen when interacting with the link (a new email message will open in email application). Also, email in the link text is useful context when the link can't be activated (plain text paste, printed page).

```md
[Email me](mailto:email@example.com)
```

✅ The following markdown will _not_ cause a warning:

```md
[email@example.com](mailto:email@example.com)
```

## More link text resources

- [A11y Collective: The Perfect Link](https://www.a11y-collective.com/blog/the-perfect-link/)
- [Get Stark: The endless search for "here" in the unhelpful "click here" button](https://www.getstark.co/blog/the-endless-search-for-here-in-the-unhelpful-click-here-button)
- [NC State University: Accessible Hyperlinks](https://accessibility.oit.ncsu.edu/accessible-hyperlinks/)
- [Penn State: Link Text](https://accessibility.psu.edu/linktext/)
- [WCAG 2.4.4: Link Purpose](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html)
- [WCAG 2.4.9: Link Purpose (Link Only)](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-link-only.html)
- [WCAG 3.2.4: Consistent Identification](https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification.html)
- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value)
- [WebAIM: Links and Hypertext - Link Text and Appearance](https://webaim.org/techniques/hypertext/link_text)
