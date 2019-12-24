import { CommandPart, CommandFlag } from "./types";

/**
 * Checks whether the command part is a flag.
 * @param part A command part to check.
 */
export function isFlag(part: CommandPart): part is CommandFlag {
  return typeof part == "object";
}
