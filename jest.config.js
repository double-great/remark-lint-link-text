export default {
  clearMocks: true,
  transformIgnorePatterns: ["!node_modules/"],
  prettierPath: "<rootDir>/node_modules/prettier-2/index.js",
  moduleNameMapper: {
    "^..?/rule.js$": "<rootDir>/src/rule.ts",
    "^..?/docs.js$": "<rootDir>/src/docs.ts",
    "^..?/utils.js$": "<rootDir>/src/rules/utils.ts",
    "^..?/rules/(.*).js$": "<rootDir>/src/rules/$1.ts",
  },
};
