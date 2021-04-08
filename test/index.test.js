import React from "react";
import { readFile } from "fs/promises";
import { shallow } from "../src";

import Resume from "./stub/resume";

it("renders correctly", async () => {
  const wrapper = await shallow(<Resume />);

  expect(wrapper.pagesNumber).toBe(3);
  expect(await wrapper.getPageImage(0)).toMatchImageSnapshot();
  expect(await wrapper.getPageImage(1)).toMatchImageSnapshot();
  expect(await wrapper.getPageImage(2)).toMatchImageSnapshot();
});

it("should work with raw pdf", async () => {
  const pdf = await readFile('./test/stub/sample.pdf');
  const wrapper = await shallow(pdf);

  expect(wrapper.pagesNumber).toBe(4);
  expect(await wrapper.containsLinkTo('http://projekty.wojtekmaj.pl/react-pdf', 0)).toBe(true);

  expect(await wrapper.getPageImage(1)).toMatchImageSnapshot();
  expect(await wrapper.getPageImage(2)).toMatchImageSnapshot();
});
