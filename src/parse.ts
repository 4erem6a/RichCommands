import { RichParserOptions } from "./RichParserOptions";
import { FlagObjectOptions, buildFlagObject } from "./buildFlagObject";
import { RichCommand } from "./types/types";
import { RichParser } from "./RichParser";
import { isArgument } from "./types/isArgument";
import { isFlag } from "./types/isFlag";

export function parse(
  source: string,
  options: RichParserOptions & FlagObjectOptions = {}
): RichCommand {
  const parser = new RichParser(source, options);

  const raw = parser.parts();

  const args = raw.filter(isArgument);
  const flags = buildFlagObject(raw.filter(isFlag), options);

  return { args, flags };
}
