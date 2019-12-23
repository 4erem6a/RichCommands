export interface RichParserOptions {
  quotes?: Array<string | [string, string]>;
  separators?: string[];
  flagMarkers?: string[];
  flagValueMarkers?: string[];
  emptyArgMarkers?: string[];
  escapeMarkers?: string[];
}
