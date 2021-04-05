import { Buffer } from "buffer";
import Canvas from "canvas";
import { pdf, render as renderFile } from "@react-pdf/renderer";
import * as pdfjs from "pdf-dist/es5/build/pdf";

const render = async (component, options = {}) => {
  if (options.file) {
    await renderFile(component, options.file);
  }

  const buff = await renderToBuffer(component);
  const loadingTask = pdfjs.getDocument({
    data: buff.buffer,
    verbosity: 0,
  });

  const pdfDocument = await loadingTask.promise;
  const page = await pdfDocument.getPage(1);
  const viewport = page.getViewport({ scale: 1.0 });
  const canvasFactory = new NodeCanvasFactory();
  const canvasAndContext = canvasFactory.create(
    viewport.width,
    viewport.height
  );
  const renderContext = {
    canvasContext: canvasAndContext.context,
    viewport,
    canvasFactory,
  };

  const renderTask = page.render(renderContext);
  await renderTask.promise;

  return canvasAndContext.canvas.toBuffer();
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
      instance.container.finish();
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

export default render;
