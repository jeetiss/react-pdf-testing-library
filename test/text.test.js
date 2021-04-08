import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { shallow } from '../src'

const Font = ({ text, font }) => (
  <View>
    <Text style={{ fontFamily: font }}>{text}</Text>
  </View>
)

it('should render Open Sans', async () => {
  const wrapper = await shallow(
    <>
      <Font text='java' font='Open Sans' />
      <Font text='script' font='Open Sans' />
      <Font text='rulez' font='Open Sans' />
    </>
  )

  expect(await wrapper.imageSnapshot({ crop: true })).toMatchImageSnapshot()
})
