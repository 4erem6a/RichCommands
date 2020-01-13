import { RichParserOptions } from "./types/RichParserOptions";
import { FlagObjectOptions } from "./utils/createFlagObject";

/**
 * Default rich parser options.
 */
export const defaultRichParserOptions: RichParserOptions = {
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
