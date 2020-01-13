import { RichParserOptions } from "./types/RichParserOptions";
import { FlagObjectOptions, createFlagObject } from "./utils/createFlagObject";
import { defaultRichParserOptions } from "./constants";
import { RichArgv } from "./types/types";
import { RichParser } from "./RichParser";
import { isArgument } from "./types/isArgument";
import { isFlag } from "./types/isFlag";
import { createRichArgv } from "./utils/createRichArgv";

type ParseOptions = RichParserOptions & Partial<FlagObjectOptions>;

/**
 * Parses the source string to a {@link RichArgv}.
 * @param source The source string.
 * @param options Parsing and processing options.
 * Parsing options override the {@link defaultRichParserOptions default ones},
 * if you want to disable a parsing option then you should explicitly set it to undefined.
 */
export function parseArgs(
  source: string,
  options: ParseOptions = {}
): RichArgv {
  const parser = new RichParser(source, {
    ...defaultRichParserOptions,
    ...options
  });

  const parts = parser.commandParts();

  return createRichArgv(parts, options);
}
