/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const { env } = require('process');
const tsconfig = require("./tsconfig.json")
const moduleNameMapper = require("tsconfig-paths-jest")(tsconfig)
env.TEST = "T"
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper
};