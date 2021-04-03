import { configureToMatchImageSnapshot } from "jest-image-snapshot";

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customSnapshotsDir: "./snapshots",
  customDiffDir: "./diffs",
});

expect.extend({ toMatchImageSnapshot });
