const { prettierCheckProject } = require("@jsenv/prettier-check-project")
const { projectFolder } = require("../../jsenv.config.js")

const prettifyDescription = {
  // js
  "/index.js": true,
  "/index.test.js": true,
  "/src/**/*.js": true,
  "/test/**/*.js": true,
  "/script/**/*.js": true,
  // json
  "/src/**/*.json": true,
  "/test/**/*.json": true,
  "/script/**/*.json": true,
  // md
  "/readme.md": true,
  "/doc/**.md": true,
  "/src/**/*.md": true,
  "/test/**/*.md": true,
  "/script/**/*.md": true,
}

prettierCheckProject({
  projectFolder,
  prettifyDescription,
})
