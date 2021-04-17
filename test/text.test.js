import React from 'react'
import { View, Text, Font } from '@react-pdf/renderer'

import { renderComponent } from '../src'

Font.register({
  family: 'Open Sans',
  src: 'https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0e.ttf'
})

const TextBox = ({ text, font }) => (
  <View>
    <Text style={{ fontFamily: font }}>{text}</Text>
  </View>
)

it('should render Open Sans', async () => {
  const wrapper = await renderComponent(
    <>
      <TextBox text='java' font='Open Sans' />
      <TextBox text='script' font='Open Sans' />
      <TextBox text='rulez' font='Open Sans' />
    </>
  )

  expect(await wrapper.imageSnapshot({ crop: true })).toMatchImageSnapshot()
})

it('should render multipage component to one snapshot', async () => {
  const TextSpliter = ({ text, font }) => (
    <>
      {text.split('').map((letter, index) => (
        <View key={letter + index} style={{ paddingLeft: 20 }}>
          <Text style={{ fontFamily: font }}>{letter}</Text>
        </View>
      ))}
    </>
  )

  const wrapper = await renderComponent(
    <TextSpliter
      text='javascript>typescript'
      font='Open Sans'
    />,

    { size: [200, 50] }
  )

  expect(await wrapper.imageSnapshot({ crop: true })).toMatchImageSnapshot()
})
