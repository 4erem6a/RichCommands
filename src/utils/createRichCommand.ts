import { Command, RichCommand } from "../types/types";
import { createRichArgv } from "./createRichArgv";
import { FlagObjectOptions } from "./createFlagObject";

/**
 * Creates a {@link RichCommand} from a {@link Command}.
 */
export function createRichCommand(
  command: Command,
  options: Partial<FlagObjectOptions>
): RichCommand {
  const { name, parts } = command;

  const { args, flags } = createRichArgv(parts, options);

  return { name, args, flags };
}
