interface Encoder {
  encode(input?: string): Uint8Array;
}

const encoderCache = new Map<string, Encoder>();

const singleByteEncodings = new Set([
  "ibm866",
  "iso-8859-2",
  "iso-8859-3",
  "iso-8859-4",
  "iso-8859-5",
  "iso-8859-6",
  "iso-8859-7",
  "iso-8859-8",
  "iso-8859-8-i",
  "iso-8859-10",
  "iso-8859-13",
  "iso-8859-14",
  "iso-8859-15",
  "iso-8859-16",
  "koi8-r",
  "koi8-u",
  "macintosh",
  "windows-874",
  "windows-1250",
  "windows-1251",
  "windows-1252",
  "windows-1253",
  "windows-1254",
  "windows-1255",
  "windows-1256",
  "windows-1257",
  "windows-1258",
  "x-mac-cyrillic",
  "x-user-defined",
]);

function encodeUtf16(input: string, littleEndian: boolean): Uint8Array {
  const output = new Uint8Array(input.length * 2);
  const view = new DataView(output.buffer);
  for (let index = 0; index < input.length; index++) {
    view.setUint16(index * 2, input.charCodeAt(index), littleEndian);
  }
  return output;
}

function addMapping(
  map: Map<string, Uint8Array>,
  decoder: TextDecoder,
  bytes: number[],
): void {
  try {
    const decoded = decoder.decode(Uint8Array.from(bytes));
    if (decoded && !map.has(decoded)) {
      map.set(decoded, Uint8Array.from(bytes));
    }
  } catch {
    // Invalid byte sequences do not have a corresponding encoded value.
  }
}

function createIso2022JpEncoder(decoder: TextDecoder): Encoder {
  const jis = new Map<string, Uint8Array>();
  for (let first = 0x21; first <= 0x7E; first++) {
    for (let second = 0x21; second <= 0x7E; second++) {
      const bytes = [0x1B, 0x24, 0x42, first, second, 0x1B, 0x28, 0x42];
      try {
        const decoded = decoder.decode(Uint8Array.from(bytes));
        if (decoded && !jis.has(decoded)) {
          jis.set(decoded, Uint8Array.of(first, second));
        }
      } catch {
        // Ignore unassigned JIS code points.
      }
    }
  }

  const katakana = new Map<string, number>();
  for (let byte = 0x21; byte <= 0x5F; byte++) {
    try {
      const decoded = decoder.decode(
        Uint8Array.of(0x1B, 0x28, 0x49, byte, 0x1B, 0x28, 0x42),
      );
      if (decoded) {
        katakana.set(decoded, byte);
      }
    } catch {
      // Ignore unassigned Katakana code points.
    }
  }

  return {
    encode(input = ""): Uint8Array {
      const output: number[] = [];
      let state: "ascii" | "jis" | "katakana" | "roman" = "ascii";

      const changeState = (next: typeof state): void => {
        if (state === next) return;
        const escapes = {
          ascii: [0x1B, 0x28, 0x42],
          jis: [0x1B, 0x24, 0x42],
          katakana: [0x1B, 0x28, 0x49],
          roman: [0x1B, 0x28, 0x4A],
        };
        output.push(...escapes[next]);
        state = next;
      };

      for (const character of input) {
        const codePoint = character.codePointAt(0) as number;
        if (codePoint <= 0x7F) {
          changeState("ascii");
          output.push(codePoint);
          continue;
        }

        const jisBytes = jis.get(character);
        if (jisBytes) {
          changeState("jis");
          output.push(...jisBytes);
          continue;
        }

        const katakanaByte = katakana.get(character);
        if (katakanaByte !== undefined) {
          changeState("katakana");
          output.push(katakanaByte);
          continue;
        }

        if (character === "¥" || character === "‾") {
          changeState("roman");
          output.push(character === "¥" ? 0x5C : 0x7E);
          continue;
        }

        changeState("ascii");
        output.push(0x3F);
      }

      changeState("ascii");
      return Uint8Array.from(output);
    },
  };
}

function addMultibyteMappings(
  map: Map<string, Uint8Array>,
  decoder: TextDecoder,
  encoding: string,
): void {
  for (let first = 0x80; first <= 0xFF; first++) {
    for (let second = 0; second <= 0xFF; second++) {
      addMapping(map, decoder, [first, second]);
    }
  }

  if (encoding === "euc-jp") {
    for (let first = 0xA1; first <= 0xFE; first++) {
      for (let second = 0xA1; second <= 0xFE; second++) {
        addMapping(map, decoder, [0x8F, first, second]);
      }
    }
  }
}

function gb18030Bytes(pointer: number): Uint8Array {
  const fourth = pointer % 10 + 0x30;
  pointer = Math.floor(pointer / 10);
  const third = pointer % 126 + 0x81;
  pointer = Math.floor(pointer / 126);
  const second = pointer % 10 + 0x30;
  const first = Math.floor(pointer / 10) + 0x81;
  return Uint8Array.of(first, second, third, fourth);
}

function encodeGb18030CodePoint(
  codePoint: number,
  decoder: TextDecoder,
): Uint8Array | undefined {
  if (codePoint >= 0x10000 && codePoint <= 0x10FFFF) {
    return gb18030Bytes(codePoint - 0x10000 + 189_000);
  }

  let low = 0;
  let high = 39_419;
  while (low <= high) {
    const pointer = Math.floor((low + high) / 2);
    const decodedCodePoint = decoder.decode(gb18030Bytes(pointer)).codePointAt(
      0,
    );
    if (decodedCodePoint === codePoint) {
      return gb18030Bytes(pointer);
    }
    if (decodedCodePoint !== undefined && decodedCodePoint < codePoint) {
      low = pointer + 1;
    } else {
      high = pointer - 1;
    }
  }
}

function createLegacyEncoder(encoding: string): Encoder {
  const decoder = new TextDecoder(encoding, {
    fatal: true,
    ignoreBOM: true,
  });
  if (encoding === "iso-2022-jp") {
    return createIso2022JpEncoder(decoder);
  }

  const map = new Map<string, Uint8Array>();

  for (let byte = 0; byte <= 0xFF; byte++) {
    addMapping(map, decoder, [byte]);
  }

  if (!singleByteEncodings.has(encoding)) {
    addMultibyteMappings(map, decoder, encoding);
  }

  const replacement = map.get("?") ?? Uint8Array.of(0x3F);

  return {
    encode(input = ""): Uint8Array {
      const characters = Array.from(input);
      const output: number[] = [];

      for (let index = 0; index < characters.length; index++) {
        const pair = characters[index] + (characters[index + 1] ?? "");
        let bytes = map.get(pair);
        if (bytes) {
          index++;
        } else {
          const character = characters[index];
          bytes = map.get(character);
          if (!bytes && encoding === "gb18030") {
            bytes = encodeGb18030CodePoint(
              character.codePointAt(0) as number,
              decoder,
            );
          }
        }

        for (const byte of bytes ?? replacement) {
          output.push(byte);
        }
      }

      return Uint8Array.from(output);
    },
  };
}

/** Returns an encoder for any encoding supported by the native TextDecoder. */
export default function getTextEncoder(label: string): Encoder {
  const encoding = new TextDecoder(label).encoding;
  const cached = encoderCache.get(encoding);
  if (cached) {
    return cached;
  }

  let encoder: Encoder;
  if (encoding === "utf-8") {
    encoder = new TextEncoder();
  } else if (encoding === "utf-16le") {
    encoder = { encode: (input = "") => encodeUtf16(input, true) };
  } else if (encoding === "utf-16be") {
    encoder = { encode: (input = "") => encodeUtf16(input, false) };
  } else {
    encoder = createLegacyEncoder(encoding);
  }

  encoderCache.set(encoding, encoder);
  return encoder;
}
