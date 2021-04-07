import React from "react";
import { shallow } from "../src";

import Resume from "./stub/resume";

it("renders correctly", async () => {
  const wrapper = await shallow(<Resume />);

  expect(wrapper.pagesNumber).toBe(3);
  expect(await wrapper.getPageImage(0)).toMatchImageSnapshot();
  expect(await wrapper.getPageImage(1)).toMatchImageSnapshot();
  expect(await wrapper.getPageImage(2)).toMatchImageSnapshot();
});
