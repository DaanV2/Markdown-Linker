export var MarkdownTags;
(function (MarkdownTags) {
    function is(value) {
        return typeof value === "object" && value !== null && Array.isArray(value.tags);
    }
    MarkdownTags.is = is;
})(MarkdownTags || (MarkdownTags = {}));
