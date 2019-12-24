import { RichParserOptions } from "./RichParserOptions";
import { FlagObjectOptions, buildFlagObject } from "./buildFlagObject";
import { defaultRichParserOptions } from "./constants";
import { RichCommand } from "./types/types";
import { RichParser } from "./RichParser";
import { isArgument } from "./types/isArgument";
import { isFlag } from "./types/isFlag";

/**
 * Parses the source string to a {@link RichCommand rich command}.
 * @param source The source string.
 * @param options Parsing and processing options.
 * Parsing options override the {@link defaultRichParserOptions default ones},
 * if you want to disable a parsing option then you should explicitly set it to undefined.
 */
export function parse(
  source: string,
  options: RichParserOptions & FlagObjectOptions = {}
): RichCommand {
  const parser = new RichParser(source, {
    ...defaultRichParserOptions,
    ...options
  });

  const raw = parser.parts();

  const args = raw.filter(isArgument);
  const flags = buildFlagObject(raw.filter(isFlag), options);

  return { args, flags };
}
