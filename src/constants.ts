import { RichParserOptions } from "./RichParserOptions";

/**
 * Default rich parser options.
 */
export const defaultRichParserOptions: RichParserOptions = {
  quotes: ['"', ["(", ")"]],
  flagMarkers: ["--", "-"],
  flagValueMarkers: ["="],
  emptyArgMarkers: ["~"],
  escapeMarkers: ["\\"],
  separators: [" ", "\n", "\r", "\t"]
};
