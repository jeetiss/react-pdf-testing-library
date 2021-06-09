# react-pdf-testing-library

Set of helpers for `react-pdf` visual testing with `jest-image-snapshot`.

## Usage

```bash
npm i -D react-pdf-testing-library
```

```js
import { Resume } from '..'
import { renderDocument } from 'react-pdf-testing-library'

it('should work', async () => {
  const document = await renderDocument(<Resume />)

  expect(document.pagesNumber).toBe(2)
  expect(await document.page(0).imageSnapshot()).toMatchImageSnapshot()
  expect(await document.page(1).imageSnapshot()).toMatchImageSnapshot()
})
```

# API

## renderComponent

takes react-pdf component and size of page and returns helpers.

```js
const wrapper = await renderComponent(<Component />, { size: 'A5' })
```

> Size is optional. can be string (`A2`, `A3`, `A4`) or tuple (`[number, number]`) with width and height size in pixels. default value is `A4`

### imageSnapshot

returns raw png image of the component. 

```js
const wrapper = await renderComponent(<Component />)

expect(await wrapper.imageSnapshot()).toMatchImageSnapshot()
```

### containsLinkTo

checks that link with href exists in the component.

```js
const wrapper = await renderComponent(<Component />)

expect(await wrapper.containsLinkTo('https://example.com')).toBe(true)
```

### containsAnchorTo

checks that component contains goto construction with specified id.

```js
const wrapper = await renderComponent(<Component />)

expect(await wrapper.containsAnchorTo('#myDest')).toBe(true)
```

## renderDocument

takes react-pdf component or raw pdf and returns document helpers.

### pagesNumber

returns amount of pages in pdf.

```js
const document = await renderDocument(<Component />)

expect(document.pagesNumber).toBe(10)
```

### page

returns object with `imageSnapshot`, `containsLinkTo` and `containsAnchorTo` helpers for page with specified index, index starts from 0.

> helpers run over selected page

```js
const document = await renderDocument(<Component />)

expect(await document.page(0).imageSnapshot()).toMatchImageSnapshot()
expect(await document.page(1).containsAnchorTo('#myDest')).toBe(true)
expect(await document.page(2).containsLinkTo('https://example.com')).toBe(true)
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
