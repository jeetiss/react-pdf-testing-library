const { readdir, readFile } = require('fs/promises')
const { uploadFile } = require('@uploadcare/upload-client')

const isCI = process.env.IS_CI === 'true'
const PUBLIC_KEY = process.env.UCKEY

class ImageReporter {
  constructor (globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onTestResult (test, testResult, aggregateResults) {
    if (
      isCI &&
      testResult.numFailingTests &&
      testResult.failureMessage.match(/different from snapshot/)
    ) {
      const files = await readdir('./diffs/')

      files.forEach(async (value) => {
        try {
          const file = await readFile(`diffs/${value}`)
          const ufile = await uploadFile(file, {
            publicKey: PUBLIC_KEY,
            fileName: value,
            contentType: 'image/png'
          })

          console.log(`Uploaded image diff file to ${ufile.cdnUrl}`)
          console.log()
        } catch (error) {
          console.log(error)
        }
      })
    }
  }
}

module.exports = ImageReporter
