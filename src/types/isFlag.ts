import { CommandPart, CommandFlag } from "./types";

export function isFlag(part: CommandPart): part is CommandFlag {
  return typeof part == "object";
}
