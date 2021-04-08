/* eslint-env node, jest */

import { configureToMatchImageSnapshot } from 'jest-image-snapshot'
import { Font } from '@react-pdf/renderer'

// setup image matcher
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotsDir: './snapshots',
  customDiffDir: './diffs'
})

expect.extend({ toMatchImageSnapshot })

// register fonts
beforeEach(() => {
  Font.register({
    family: 'Open Sans',
    src:
      'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf'
  })
})

// reset all registered fonts
afterEach(() => {
  Font.clear()
})
