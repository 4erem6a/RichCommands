import { CommandPart, CommandArgument } from "./types";

/**
 * Checks whether the command part is an argument.
 * @param part A Command part to check.
 */
export function isArgument(part: CommandPart): part is CommandArgument {
  return typeof part != "object";
}
