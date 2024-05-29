import { dialog } from "electron";
import { readFileSync } from "node:fs";
import { SourceMapConsumer } from "@jridgewell/source-map";
import { basename } from "node:path";
export interface SourceMapParserData {
  sourceMapPath: string;
  line: number;
  column: number;
}

export async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({});
  if (!canceled) {
    return filePaths[0];
  }
}

export function parseSourceMap({ sourceMapPath, line, column }: SourceMapParserData) {
  return new Promise(async (resolve, reject) => {
    const sourceMapData = readFileSync(sourceMapPath).toString();

    const sourceMapConsumer = new SourceMapConsumer(sourceMapData, undefined);

    const compressedLine = Number(line);
    const compressedColumn = Number(column);

    const originalPosition = sourceMapConsumer.originalPositionFor({
      line: compressedLine,
      column: compressedColumn,
    });

    if (originalPosition.source) {
      const sourceContent = sourceMapConsumer.sourceContentFor(originalPosition.source);
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
