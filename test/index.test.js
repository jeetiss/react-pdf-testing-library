import React from 'react'
import { readFile } from 'fs/promises'
import { renderDocument } from '../src'

import Resume from './stub/resume'

it('should render pdf from components correctly', async () => {
  const document = await renderDocument(<Resume />)

  expect(document.pagesNumber).toBe(3)
  expect(await document.page(0).imageSnapshot()).toMatchImageSnapshot()
  expect(await document.page(1).imageSnapshot()).toMatchImageSnapshot()
  expect(await document.page(2).imageSnapshot()).toMatchImageSnapshot()
})

it('should work with raw pdf', async () => {
  const pdf = await readFile('./test/stub/sample.pdf')
  const wrapper = await renderDocument(pdf)

  expect(
    await wrapper
      .page(0)
      .containsLinkTo('http://projekty.wojtekmaj.pl/react-pdf')
  ).toBe(true)

  expect(await wrapper.page(1).imageSnapshot()).toMatchImageSnapshot()
  expect(await wrapper.page(2).imageSnapshot()).toMatchImageSnapshot()
})
