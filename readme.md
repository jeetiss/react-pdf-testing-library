# test-pdfs-demo

Demo of pdf visual testing with `jest-image-snapshot`.

### usage

1. fork this repo
2. install dependencies with `npm i`
3. build crop wasm with `npm run build`
4. run `npm test`

### roadmap 

- [x]  generate pdf
- [x]  render pdf to png
- [x]  ~~links ?? fix annotation layer~~ pfjs doesn't render default fonts in nodejs (Helvetica, ect)
- [x]  component / document rendering
- [x]  multipage pdf (aka "integration" tests)
- [x]  test links
- [x]  crop content ?? (aka unit tests)
- [x]  upload failed images to cdn ??
- [x]  gha integration
- [ ]  store managment for snapshots ??
