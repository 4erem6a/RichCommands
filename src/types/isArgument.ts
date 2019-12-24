import { CommandPart, CommandArgument } from "./types";

export function isArgument(part: CommandPart): part is CommandArgument {
  return typeof part != "object";
}
