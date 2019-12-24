import { RichParserOptions } from "./RichParserOptions";

export const defaultRichParserOptions: RichParserOptions = {
  quotes: ['"', ["(", ")"]],
  flagMarkers: ["--", "-"],
  flagValueMarkers: ["="],
  emptyArgMarkers: ["~"],
  escapeMarkers: ["\\"],
  separators: [" ", "\n", "\r", "\t"]
};
