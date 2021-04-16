/* eslint-env node, jest */

import { configureToMatchImageSnapshot } from 'jest-image-snapshot'

// setup image matcher
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotsDir: './snapshots',
  customDiffDir: './diffs'
})

expect.extend({ toMatchImageSnapshot })
