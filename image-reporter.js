const chalk = require('chalk')
const { readdir, readFile, writeFile } = require('fs/promises')
const { uploadFile } = require('@uploadcare/upload-client')

const isCI = process.env.IS_CI === 'true'
const PUBLIC_KEY = process.env.UCKEY

class ImageReporter {
  constructor (globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onRunComplete (_, results) {
    if (!isCI) return
    if (
      results.testResults.some(
        (testResult) =>
          testResult.numFailingTests &&
          testResult.failureMessage.match(/different from snapshot/)
      )
    ) {
      const files = await readdir('./diffs/')
      const snapshots = await Promise.all(files.map(async (value) => {
        try {
          const file = await readFile(`diffs/${value}`)
          const ufile = await uploadFile(file, {
            publicKey: PUBLIC_KEY,
            fileName: value,
            contentType: 'image/png'
          })
          console.log(
            chalk.red.bold(
              `Uploaded image diff file to ${chalk.red(ufile.cdnUrl)}`
            )
          )

          return { url: ufile.cdnUrl, file: value }
        } catch (error) {
          console.log(error)
        }
      }))

      await writeFile('./snapshotresults.json', JSON.stringify({ snapshots }, null, 2))
    }
  }
}

module.exports = ImageReporter
