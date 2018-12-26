module.exports = {
  format: {
    "**/*.js": true,
    "**/*.json": true,
    "**/*.md": true,
    node_modules: false, // eslint-disable-line camelcase
    dist: false,
    "package.json": false,
    "package-lock.json": false,
  },
  compile: {
    "**/*.js": true,
    node_modules: false, // eslint-disable-line camelcase
    dist: false,
    script: false,
    config: false,
    ".eslintrc.js": false,
    "prettier.config.js": false,
  },
}
