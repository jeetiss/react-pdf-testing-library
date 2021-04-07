import React from "react";
import render from "../src";

import slider from "./stub/knobs";
import text from "./stub/text";
import goto from "./stub/go-to";
import Resume from "./stub/resume";

it("renders correctly", async () => {
  const image = await render(slider);

  expect(image).toMatchImageSnapshot();
});

it("works with text", async () => {
  const image = await render(text);

  expect(image).toMatchImageSnapshot();
});

it("works render links", async () => {
  const image = await render(goto);

  expect(image).toMatchImageSnapshot();
});

it("works with resume", async () => {
  const image = await render(<Resume />);

  expect(image).toMatchImageSnapshot();
});
