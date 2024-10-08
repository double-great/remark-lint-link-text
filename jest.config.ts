import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    clearMocks: true,
    transformIgnorePatterns: ["!node_modules/"],
    prettierPath: require.resolve("prettier-2"),
    moduleNameMapper: {
      "^..?/rule.js$": "<rootDir>/src/rule.ts",
      "^..?/docs.js$": "<rootDir>/src/docs.ts",
      "^..?/utils.js$": "<rootDir>/src/rules/utils.ts",
      "^..?/rules/(.*).js$": "<rootDir>/src/rules/$1.ts",
    },
  };
};
