"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
    testMatch: ["**/test/**/*.test.ts"],
};
module.exports = config;
