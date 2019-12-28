import { CommandPart, RichArgv } from "./types/types";
import { FlagObjectOptions, buildFlagObject } from "./buildFlagObject";
import { isArgument } from "./types/isArgument";
import { isFlag } from "./types/isFlag";

/**
 * Creates a {@link RichArgv} object from command parts.
 * @param parts Command parts.
 */
export function buildRichArgv(
  parts: CommandPart[],
  flagObjectOptions?: FlagObjectOptions
): RichArgv {
  const args = parts.filter(isArgument);
  const flags = buildFlagObject(parts.filter(isFlag), flagObjectOptions);

  return { args, flags };
}
