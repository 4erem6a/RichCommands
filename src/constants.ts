import { RichParserOptions } from "./RichParserOptions";
import { FlagObjectOptions } from "./buildFlagObject";

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
  allowArrayValues: true
};
