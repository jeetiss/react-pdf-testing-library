import React from "react";
import { shallow } from "../src";
import { Link, Font } from "@react-pdf/renderer";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

it("should render links as anchors", async () => {
  const wrapper = await shallow(
    <Link href="#myDest" style={{ fontFamily: "Oswald" }}>
      Link
    </Link>
  );

  expect(await wrapper.containsAnchorTo("#myDest")).toBe(true);
  expect(await wrapper.getPageImage()).toMatchImageSnapshot();
});

it("should render links as links", async () => {
  const wrapper = await shallow(
    <Link
      style={{ fontFamily: "Oswald" }}
      src="https://es.wikipedia.org/wiki/Lorem_ipsum"
    >
      Lorem Ipsum
    </Link>
  );

  expect(
    await wrapper.containsLinkTo("https://es.wikipedia.org/wiki/Lorem_ipsum")
  ).toBe(true);
  expect(await wrapper.getPageImage()).toMatchImageSnapshot();
});
