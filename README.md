# remark-lint-link-text

A remark-lint plugin that warns against non-descriptive link text.

```md
✅ Visit [Mapbox documentation](https://docs.mapbox.com) to learn more.
🚫 Learn more [here](https://docs.mapbox.com).
```

The linter warns against:

- contextless phrases such as "click here" and "read more."
- link text that's used more than once for different URLs.
- using a URL as the link text.
- missing link text or missing alt text if the link is an image.

💡 For all banned phrases that begin with `this` or `the`, any words that come between will also fail. For example "this post", "this Mapbox post", and "this Mapbox blog post" will all fail.

## Install

```
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

## Banned link text

Save banned link text in [src/banned.ts](src/banned.ts).

## Proper link text guidelines

> When calling the user to action, use brief but meaningful link text that:
>
> - provides some information when read out of context
> - explains what the link offers
> - doesn't talk about mechanics
> - is not a verb phrase

- https://www.w3.org/QA/Tips/noClickHere

> Write links that make sense out of context. Use descriptive link text detailing the destination; not just “click here,” or other similar phrases.

- http://accessibility.psu.edu/linktext/
