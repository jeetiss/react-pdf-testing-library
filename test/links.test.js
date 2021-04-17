import React from 'react'
import { Link, Font } from '@react-pdf/renderer'

import { renderComponent } from '../src'

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf'
})

it('should render links as anchors', async () => {
  const wrapper = await renderComponent(
    <Link href='#myDest' style={{ fontFamily: 'Open Sans' }}>
      Link
    </Link>
  )

  expect(await wrapper.containsAnchorTo('#myDest')).toBe(true)
  expect(
    await wrapper.imageSnapshot({ crop: ['bottom', 'right'] })
  ).toMatchImageSnapshot()
})

it('should render links as links', async () => {
  const wrapper = await renderComponent(
    <Link
      style={{ fontFamily: 'Open Sans' }}
      src='https://es.wikipedia.org/wiki/Lorem_ipsum'
    >
      Lorem Ipsum
    </Link>
  )

  expect(
    await wrapper.containsLinkTo('https://es.wikipedia.org/wiki/Lorem_ipsum')
  ).toBe(true)

  expect(await wrapper.containsLinkTo('https://example.com')).toBe(false)

  expect(
    await wrapper.imageSnapshot({ crop: ['bottom', 'right'] })
  ).toMatchImageSnapshot()
})
