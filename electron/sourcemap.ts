import { dialog } from "electron";
import { readFileSync } from "node:fs";
import { SourceMapConsumer } from "@jridgewell/source-map";
import { basename } from "node:path";
export interface SourcemapParserData {
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

export function parseSourceMap({ sourcemapPath, line, column }: SourcemapParserData) {
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
      const data = {
        filename: basename(originalPosition.source),
        line: originalPosition.line,
        column: originalPosition.column,
        content: sourceContent,
      };
      resolve(data);
    } else {
      reject(false);
    }
  });
}
