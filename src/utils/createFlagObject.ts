import { CommandFlag, CommandFlags, CommandFlagValue } from "../types/types";
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
 * Shorthand for String#localeCompare to perform case insensitive string comparison.
 * @param str1 The first string to be compared.
 * @param str2 The second string to be compared.
 * @ignore
 */
function compareStrings(
  str1: string,
  str2: string,
  caseSensitivity: boolean
): boolean {
  return (
    str1.localeCompare(str2, undefined, {
      sensitivity: caseSensitivity ? "variant" : "accent"
    }) == 0
  );
}

/**
 * Makes flag object keys case insensitive.
 * @param flagObject The flag object to make case insensitive.
 * @ignore
 */
function makeCaseInsensitive(flagObject: CommandFlags): CommandFlags {
  return new Proxy(flagObject, {
    get(target, key): CommandFlagValue | CommandFlagValue[] {
      return Object.entries(target).find(([k]) =>
        compareStrings(k, key.toString(), false)
      )?.[1];
    },
    has(target, key): boolean {
      const matchingKey = Object.keys(target).find(k =>
        compareStrings(k, key.toString(), false)
      );

      return matchingKey ? Reflect.has(target, matchingKey) : false;
    }
  });
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
   * Whether flags names & flag object keys are case insensitive.
   * @example
   * const flagObject = createFlagObject([
   *  { name: 'SampleFlag', value: '1' },
   *  { name: 'sampleflag', value: '2' }
   * ], {
   *  allowArrayValues: true,
   *  caseInsensitiveFlags: true
   * });
   *
   * const sampleFlag = flagObject.sampleFlag; // [ '1', '2' ]
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
  const { allowArrayValues, caseInsensitiveFlags } = {
    ...defaultFlagObjectOptions,
    ...options
  };

  const isUniqueFlagName = (names: string[], name: string): boolean =>
    !names.some(n => compareStrings(n, name, !caseInsensitiveFlags));

  const names = flags
    .map(flag => flag.name)
    .reduce(
      (names, name) =>
        isUniqueFlagName(names, name) ? [...names, name] : names,
      [] as string[]
    );

  const flagNameFilter = (name: string) => (flag: CommandFlag): boolean =>
    compareStrings(flag.name, name, !caseInsensitiveFlags);

  const entries = names.map(name => ({
    [name]: allowArrayValues
      ? getFirstIfOnly(
          flags.filter(flagNameFilter(name)).map(flag => flag.value)
        )
      : flags.find(flagNameFilter(name))?.value
  }));

  const flagObject = entries.reduce((acc, v) => ({ ...acc, ...v }), {});

  return caseInsensitiveFlags ? makeCaseInsensitive(flagObject) : flagObject;
}
