// import React from "react";
import render from "../src";
import slider from "./stub/knobs";
import text from "./stub/text";

it("renders correctly", async () => {
  const image = await render(slider);

  expect(image).toMatchImageSnapshot();
});

it("works with text", async () => {
  // { file: './text.pdf' }
  const image = await render(text);

  expect(image).toMatchImageSnapshot();
});
