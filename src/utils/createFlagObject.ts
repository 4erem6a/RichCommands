import { CommandFlag, CommandFlags } from "../types/types";
import { defaultFlagObjectOptions } from "../constants";

/**
 * Returns the first element of an array if it is the only one.
 * @param arr The array to work with.
 * @ignore
 */
function getFirstIfOnly<T>(arr: T[]): T | T[] {
  return arr.length == 1 ? arr[0] : arr;
}

/**
 * Options for creating a flag object.
 */
export interface FlagObjectOptions {
  /**
   * If true, multiple flags with the same name will be merged into an array flag with all the values.
   * Otherwise, only the first flag with that name will be used.
   */
  allowArrayValues: boolean;

  /**
   * Whether flags names are case insensitive.
   */
  caseInsensitiveFlags: boolean;
}

/**
 * Creates the flag object from raw command flags.
 * @param flags Raw command flags.
 * @param options Flag object options.
 * Flag object options override the {@link defaultFlagObjectOptions default ones},
 * if you want to disable a flag object option then you should explicitly set it to undefined.
 */
export function createFlagObject(
  flags: CommandFlag[],
  options: Partial<FlagObjectOptions> = {}
): CommandFlags {
  const { allowArrayValues } = { ...defaultFlagObjectOptions, ...options };

  const keys = [...new Set(flags.map(flag => flag.name))];

  const flagNameFilter = (name: string) => (flag: CommandFlag) =>
    flag.name.localeCompare(name, undefined, {
      sensitivity: options.caseInsensitiveFlags ? "accent" : "variant"
    }) == 0;

  const entries = keys.map(key => ({
    [key]: allowArrayValues
      ? getFirstIfOnly(
          flags.filter(flagNameFilter(key)).map(flag => flag.value)
        )
      : flags.find(flagNameFilter(key))?.value
  }));

  return entries.reduce((acc, v) => ({ ...acc, ...v }), {});
}
