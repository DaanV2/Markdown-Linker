export interface MarkdownTags {
  tags: Array<string>;
}

export namespace MarkdownTags {
  export function is(value: any): value is MarkdownTags {
    return typeof value === "object" && value !== null && Array.isArray(value.tags);
  }
}
