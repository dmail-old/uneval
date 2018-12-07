const { forEachRessourceMatching } = require("@dmail/project-structure")
const {
  compileFile,
  fileSystemWriteCompileResult,
} = require("@dmail/project-structure-compile-babel")
const projectConfig = require("../config/project.config.js")

const { localRoot, plugins } = projectConfig

forEachRessourceMatching(
  localRoot,
  projectConfig.metaMap,
  ({ compile }) => compile,
  async (ressource) => {
    const { code, map } = await compileFile(ressource, { localRoot, plugins })
    const outputFolder = `dist`

    await fileSystemWriteCompileResult(
      {
        code,
        map,
      },
      {
        localRoot,
        outputFile: ressource,
        outputFolder,
      },
    )
    console.log(`${ressource} -> ${outputFolder}/${ressource}`)
  },
)
