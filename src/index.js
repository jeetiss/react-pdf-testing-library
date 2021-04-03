import Canvas from "canvas";
import { resolve } from "path";
import { readFile } from "fs/promises";
import * as pdfjs from "pdf-dist/es5/build/pdf";
import { cwd } from "process";

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

const render = async (path) => {
  const data = new Uint8Array(await readFile(resolve(cwd(), "test", path)));

  const loadingTask = pdfjs.getDocument({
    data,
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

export default render;
