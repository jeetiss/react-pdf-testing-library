import React from 'react'
import { shallow } from '../src'
import { Link } from '@react-pdf/renderer'

it('should render links as anchors', async () => {
  const wrapper = await shallow(
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
  const wrapper = await shallow(
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
  expect(
    await wrapper.imageSnapshot({ crop: ['bottom', 'right'] })
  ).toMatchImageSnapshot()
})
