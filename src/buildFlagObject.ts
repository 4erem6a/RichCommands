import { CommandFlag, CommandFlags, CommandFlagValue } from "./types/types";

function getFirstIfOnly<T>(arr: T[]): T | T[] {
  return arr.length == 1 ? arr[0] : arr;
}

export interface FlagObjectOptions {
  allowArrayValues?: boolean;
}

export function buildFlagObject(
  flags: CommandFlag[],
  { allowArrayValues = true }: FlagObjectOptions
): CommandFlags {
  const keys = [...new Set(flags.map(flag => flag.name))];

  const entries = keys.map(key => ({
    [key]: allowArrayValues
      ? getFirstIfOnly(
          flags.filter(flag => flag.name == key).map(flag => flag.value)
        )
      : flags.find(flag => flag.name == key)?.value
  }));

  return entries.reduce((acc, v) => ({ ...acc, ...v }), {});
}
