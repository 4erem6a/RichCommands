import { RichParserOptions } from "./types/RichParserOptions";
import { FlagObjectOptions } from "./utils/createFlagObject";
import { defaultRichParserOptions } from "./constants";
import { RichArgv, RichCommand } from "./types/types";
import { RichParser } from "./RichParser";
import { createRichArgv } from "./utils/createRichArgv";
import { createRichCommand } from "./utils/createRichCommand";

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

/**
 * Tries to parse the source string to a {@link RichCommand}.
 * @param source The source string.
 * @param options Parsing and processing options.
 * Parsing options override the {@link defaultRichParserOptions default ones},
 * if you want to disable a parsing option then you should explicitly set it to undefined.
 * @returns A rich command if command was parsed successfully, null otherwise.
 */
export function parseCommand(
  source: string,
  options: ParseOptions = {}
): RichCommand | null {
  const parser = new RichParser(source, {
    ...defaultRichParserOptions,
    ...options
  });

  const command = parser.command();

  if (!command) {
    return null;
  }

  const richCommand = createRichCommand(command, options);

  return richCommand;
}
