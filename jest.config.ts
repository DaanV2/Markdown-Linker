import { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["**/test/**/*.test.ts"],
};

module.exports = config;

