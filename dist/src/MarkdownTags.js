"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownTags = void 0;
var MarkdownTags;
(function (MarkdownTags) {
    function is(value) {
        return typeof value === "object" && value !== null && Array.isArray(value.tags);
    }
    MarkdownTags.is = is;
})(MarkdownTags = exports.MarkdownTags || (exports.MarkdownTags = {}));
