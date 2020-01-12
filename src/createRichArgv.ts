import { CommandPart, RichArgv } from "./types/types";
import { FlagObjectOptions, createFlagObject } from "./createFlagObject";
import { isArgument } from "./types/isArgument";
import { isFlag } from "./types/isFlag";

/**
 * Creates a {@link RichArgv} object from command parts.
 * @param parts Command parts.
 */
export function createRichArgv(
  parts: CommandPart[],
  flagObjectOptions?: FlagObjectOptions
): RichArgv {
  const args = parts.filter(isArgument);
  const flags = createFlagObject(parts.filter(isFlag), flagObjectOptions);

  return { args, flags };
}
