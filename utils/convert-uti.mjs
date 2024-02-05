#!/usr/bin/env node

import { spawn } from "node:child_process";
import wellKnown from "../src/well-known-utis.mjs";

function asArray(object) {
  return Array.isArray(object) ? object : object === undefined ? [] : [object];
}

function asScalar(object) {
  if (object !== undefined && object?.size > 0) {
    if (object.size === 1) {
      for (const o of object) {
        return o;
      }
    }
    return [...object];
  }
}

const lsregister = spawn(
  "/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister",
  ["-dump"]
);

let name, conformsTo, tags;

for await (const line of lineIterator(lsregister.stdout)) {
  let m = line.match(/^([^:]+):\s+(.+)/);
  if (m) {
    switch (m[1]) {
      case "uti":
        name = m[2];
        break;
      case "conforms to":
        conformsTo = m[2].split(/\s*,\s*/);
        break;
      case "tags":
        tags = m[2].split(/\s*,\s*/);
        break;
    }
  }

  if (name && line.match(/^-/)) {
    const b = wellKnown.find(u => u.name === name);
    const a = {
      name,
      conformsTo: asScalar([...asArray(conformsTo), ...asArray(b?.conformsTo)]),
      fileNameExtension: asScalar(
        new Set([
          ...asArray(tags?.filter(t => t.match(/^\./))),
          ...asArray(b?.fileNameExtension)
        ])
      ),
      mimeType: asScalar([
        ...asArray(tags?.filter(t => t.match(/^\w+\//))),
        ...asArray(b?.mimeType)
      ])
    };

    if (b) {
      for (const p of ["conformsTo", "fileNameExtension", "mimeType"]) {
        if (Array.isArray(b[p])) {
          a[p] = b[p];
        }
      }
    } else {
      wellKnown.push(a);
    }

    name = undefined;
    conformsTo = undefined;
    tags = undefined;
  }
}

console.log(JSON.stringify(wellKnown, undefined, 2));

export async function* lineIterator(stream, decoder = new TextDecoder()) {
  const re = /\r?\n/gm;
  let chunk = "";
  let startIndex = 0;

  for await (const value of stream) {
    chunk += decoder.decode(value);
    while (true) {
      const result = re.exec(chunk);
      if (result) {
        yield chunk.substring(startIndex, result.index);
        startIndex = re.lastIndex;
      } else {
        chunk = chunk.substring(startIndex);
        startIndex = re.lastIndex = 0;
        break;
      }
    }
  }

  if (startIndex < chunk.length) {
    yield chunk;
  }
}
