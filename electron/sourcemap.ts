import { dialog } from "electron";
import { readFileSync } from "node:fs";
import { SourceMapConsumer } from "@jridgewell/source-map";

export interface SourceMapParserData {
  sourcemapPath: string;
  line: number;
  column: number;
}

export async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

export function parseSourceMap({ sourcemapPath, line, column }: SourceMapParserData) {
  return new Promise(async (resolve, reject) => {
    const sourcemapData = readFileSync(sourcemapPath).toString();

    const sourcemapConsumer = new SourceMapConsumer(sourcemapData, undefined);

    const compressedLine = Number(line);
    const compressedColumn = Number(column);

    const originalPosition = sourcemapConsumer.originalPositionFor({
      line: compressedLine,
      column: compressedColumn,
    });

    if (originalPosition.source) {
      const sourceContent = sourcemapConsumer.sourceContentFor(originalPosition.source);
      console.log(sourceContent)
      if (sourceContent) {
        const lines = sourceContent.split("\n");
        const codeArr = [];
        for (let i = -2; i <= 3; i++) {
          codeArr.push(lines[originalPosition.line - i]);
        }
        resolve(codeArr.join("\n"));
      }
    } else {
      reject(false);
    }
  });
}
