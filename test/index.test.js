import render from "../src";

it("renders correctly", async () => {
  const image = await render("./stub/sample.pdf");

  expect(image).toMatchImageSnapshot();
});
