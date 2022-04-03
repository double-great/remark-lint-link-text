/* eslint-disable @typescript-eslint/no-unused-vars */
import { TextNode } from "./index.js";

export default class Rule {
  recommendation!: string;

  check({
    text,
    node,
    nodes,
    altText,
    hasImage,
  }: {
    text: string;
    node?: TextNode;
    nodes?: TextNode[];
    altText?: string;
    hasImage?: boolean;
  }): string | undefined {
    throw new Error("check() method not implemented.");
  }

  setRecommendation(value?: string) {
    throw new Error("setRecommendation() method not implemented.");
  }

  suggestion() {
    return `${this.recommendation}`;
  }
}
