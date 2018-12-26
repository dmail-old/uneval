const { format } = require("@dmail/prettiest")
const { localRoot, metaMap } = require("../config/project.config.js")

format({
  localRoot,
  metaMap,
})
