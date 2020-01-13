import { ParserOptions } from "./types/ParserOptions";
import { FlagObjectOptions } from "./utils/createFlagObject";

/**
 * Default rich parser options.
 */
export const defaultParserOptions: ParserOptions = {
  quotes: ['"', ["(", ")"]],
  flagMarkers: ["--", "-"],
  flagValueMarkers: ["="],
  emptyArgMarkers: ["~"],
  escapeMarkers: ["\\"],
  separators: [" ", "\n", "\r", "\t"],
  restMarkers: ["::"]
};

/**
 * Default flag object options.
 */
export const defaultFlagObjectOptions: FlagObjectOptions = {
  allowArrayValues: true,
  caseInsensitiveFlags: false
};
