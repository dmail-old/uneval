const { prettiest } = require("@dmail/prettiest")
const {
  namedValueDescriptionToMetaDescription,
  selectAllFileInsideFolder,
} = require("@dmail/project-structure")
const { projectFolder } = require("./util.js")

selectAllFileInsideFolder({
  pathname: projectFolder,
  metaDescription: namedValueDescriptionToMetaDescription({
    formattable: {
      "/**/*.js": true,
      "/**/*.json": true,
      "/**/*.md": true,
      "/node_modules/": false,
      "/dist/": false,
      "/package.json": false,
      "/package-lock.json": false,
    },
  }),
  predicate: (meta) => meta.formattable === true,
  transformFile: ({ filenameRelative }) => filenameRelative,
}).then((filenameRelativeArray) => {
  prettiest({
    folder: projectFolder,
    filenameRelativeArray: filenameRelativeArray.sort(),
  })
})
