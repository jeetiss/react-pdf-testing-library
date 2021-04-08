import React from "react";
import { Buffer } from "buffer";
import Canvas from "canvas";
import { pdf, render as renderFile, Document, Page } from "@react-pdf/renderer";
import * as pdfjs from "pdfjs-dist/es5/build/pdf";
import { crop } from "./crop";

const render = async (component, options = {}) => {
  if (options.file) {
    await renderFile(component, options.file);
  }

  return renderToBuffer(component);
};

const Wrapper = ({ children }) => {
  let wop_wop_JIVEM_JIVEM = children;
  if (typeof children.type === "function") {
    wop_wop_JIVEM_JIVEM = children.type(children.props);
  }

  if (wop_wop_JIVEM_JIVEM.type !== Document) {
    return (
      <Document>
        <Page size="A4">{children}</Page>
      </Document>
    );
  }

  return wop_wop_JIVEM_JIVEM;
};

const shallow = async (element) => {
  const source = await render(<Wrapper>{element}</Wrapper>);
  const document = await pdfjs.getDocument({
    data: source.buffer,
    verbosity: 5,
  }).promise;

  const pages = Array.from(
    { length: document.numPages },
    (_, i) => i
  ).map((index) => document.getPage(index + 1));

  const getPage = (index) => {
    if (index == null && document.numPages !== 1)
      throw Error(
        "Document contains more than 1 page, please provide a index of page for rendering"
      );

    return pages[index ?? 0];
  };

  return {
    get pagesNumber() {
      return document.numPages;
    },

    async getPageImage(index, options) {
      if (typeof options === "undefined") {
        options = typeof index === "object" ? index : { index };
        index = options.index;
      }

      const page = await getPage(index);
      const viewport = page.getViewport({ scale: 1.0 });
      const canvasFactory = new NodeCanvasFactory();
      const { canvas, context } = canvasFactory.create(
        viewport.width,
        viewport.height
      );
      const renderContext = {
        canvasContext: context,
        viewport,
        canvasFactory,
      };

      const renderTask = page.render(renderContext);
      await renderTask.promise;

      if (options.crop) {
        const docCoods = {
          top: 0,
          left: 0,
          bottom: canvas.height,
          right: canvas.width,
        };
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const contentCoords = await crop(imageData);
        const cropDimensions = normalize(options.crop);

        cropDimensions.forEach((dimension) => {
          docCoods[dimension] = contentCoords[dimension];
        });

        const sx = docCoods.top;
        const sy = docCoods.left;
        const sWidth = docCoods.right - docCoods.left + 1;
        const sHeight = docCoods.bottom - docCoods.top + 1;

        const cropedCanvas = Canvas.createCanvas(sWidth, sHeight);
        const ctx = cropedCanvas.getContext("2d");

        ctx.drawImage(canvas, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight);

        return cropedCanvas.toBuffer();
      }

      return canvas.toBuffer();
    },

    async containsLinkTo(href, pageIndex) {
      const page = await getPage(pageIndex);
      const annotations = await page.getAnnotations();

      return annotations.some(
        (annotation) => annotation.subtype === "Link" && annotation.url === href
      );
    },

    async containsAnchorTo(dest, pageIndex) {
      const page = await getPage(pageIndex);
      const annotations = await page.getAnnotations();

      if (dest.startsWith("#")) {
        dest = dest.substring(1);
      }

      return annotations.some(
        (annotation) =>
          annotation.subtype === "Link" && annotation.dest === dest
      );
    },
  };
};

const normalize = (options) => {
  if (!Array.isArray(options)) {
    return typeof options === "boolean"
      ? ["bottom", "left", "right", "top"]
      : [options];
  }

  return options;
};

const renderToBuffer = async function (element) {
  const instance = pdf(element);
  const stream = await instance.toBuffer();

  return new Promise((resolve) => {
    var bufs = [];
    stream.on("data", function (d) {
      bufs.push(d);
    });
    stream.on("end", function () {
      resolve(Buffer.concat(bufs));
      instance.container.finish && instance.container.finish();
    });
  });
};

class NodeCanvasFactory {
  create(width, height) {
    const canvas = Canvas.createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  }
}

export { render, shallow };
