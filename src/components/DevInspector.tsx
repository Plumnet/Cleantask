"use client";

import { Inspector } from 'react-dev-inspector';

export function DevInspector() {
  return (
    <Inspector
      onInspectElement={({ codeInfo }) => {
      console.log('codeInfo:', codeInfo);

        const { lineNumber, columnNumber, relativePath, absolutePath } = codeInfo;
        const fileName = relativePath || absolutePath;
        if (!fileName) return;

        const params = new URLSearchParams({
          fileName,
          lineNumber: String(lineNumber),
          colNumber: String(columnNumber),
        });

        fetch(`/api/open-in-editor?${params}`);
      }}
    />
  );
}