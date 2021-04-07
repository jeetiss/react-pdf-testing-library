import React from "react";
import { Page, Document, Link, View, Image, Font } from "@react-pdf/renderer";

Font.register({
  family: "Oswald",
  src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
});

const doc = (
  <Document>
    <Page size="A4">
      <Link href="#myDest" style={{ fontFamily: "Oswald" }}>
        Link
      </Link>

      <Link
        style={{ fontFamily: "Oswald" }}
        src="https://es.wikipedia.org/wiki/Lorem_ipsum"
      >
        Lorem Ipsum
      </Link>
    </Page>

    <Page size="A4">
      <View style={{ height: 300, backgroundColor: "black" }} />
      <Image
        id="myDest"
        src="http://qnimate.com/wp-content/uploads/2014/03/images2.jpg"
      />
    </Page>
  </Document>
);

export default doc;
