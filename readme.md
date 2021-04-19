# test-pdfs-demo

Demo of pdf visual testing with `jest-image-snapshot`.

## Usage

```js
import { Resume } from '..'
import { renderDocument } from '..'

it('should work', async () => {
  const document = await renderDocument(<Resume />)

  expect(document.pagesNumber).toBe(2)
  expect(await document.page(0).imageSnapshot()).toMatchImageSnapshot()
  expect(await document.page(1).imageSnapshot()).toMatchImageSnapshot()
})
```

## Build

Clone this repo, `cd` into it, make sure you’re using Node 12+, and then:

```sh
npm i
npm run build
```

## Run

Then run jest

```sh
npm test
```

## License

MIT
