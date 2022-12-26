export interface MarkdownTags {
  tags: Array<string>;
}

export namespace MarkdownTags {
  export function is(value: any): value is MarkdownTags {
    return typeof value === "object" && value !== null && Array.isArray(value.tags);
  }
}

export interface SerializedTagMap {
  tag: string;
  url: string;
  search?: string;
}

export namespace SerializedTagMap {
  export function is(value: any): value is SerializedTagMap {
    return typeof value === "object" && typeof value.tag === "string";
  }
}
