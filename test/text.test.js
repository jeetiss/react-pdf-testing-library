import React from "react";
import { View, Text } from "@react-pdf/renderer";
import { shallow } from "../src";

const Font = ({ text, font }) => (
  <View>
    <Text style={{ fontFamily: font }}>{text}</Text>
  </View>
);

it("should render Open Sans", async () => {
  const wrapper = await shallow(
    <Font text="hello Open Sans" font="Open Sans" />
  );

  expect(await wrapper.getPageImage({ crop: true })).toMatchImageSnapshot();
});
