import { ParserOptions } from "./types/ParserOptions";
import { FlagObjectOptions } from "./utils/createFlagObject";
import { defaultParserOptions } from "./constants";
import { RichArgv, RichCommand } from "./types/types";
import { Parser } from "./Parser";
import { createRichArgv } from "./utils/createRichArgv";
import { createRichCommand } from "./utils/createRichCommand";

type ParseOptions = ParserOptions & Partial<FlagObjectOptions>;

/**
 * Parses the source string to a {@link RichArgv}.
 * @param source The source string.
 * @param options Parsing and processing options.
 * Parsing options override the {@link defaultParserOptions default ones},
 * if you want to disable a parsing option then you should explicitly set it to undefined.
 */
export function parseArgs(source: string, options: ParseOptions = {}): RichArgv {
  const parser = new Parser(source, {
    ...defaultParserOptions,
    ...options
  });

  const parts = parser.commandParts();

  return createRichArgv(parts, options);
}

/**
 * Tries to parse the source string to a {@link RichCommand}.
 * @param source The source string.
 * @param options Parsing and processing options.
 * Parsing options override the {@link defaultParserOptions default ones},
 * if you want to disable a parsing option then you should explicitly set it to undefined.
 * @returns A rich command if command was parsed successfully, null otherwise.
 */
export function parseCommand(
  source: string,
  options: ParseOptions = {}
): RichCommand | null {
  const parser = new Parser(source, {
    ...defaultParserOptions,
    ...options
  });

  const command = parser.command();

  if (!command) {
    return null;
  }

  const richCommand = createRichCommand(command, options);

  return richCommand;
}
