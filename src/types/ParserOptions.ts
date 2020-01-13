/**
 * Options describing the command syntax for the {@link RichParser}.
 */
export interface ParserOptions {
  /**
   * Quoted argument markers.
   * A quote may be single ( " ) or paired ( {, } ).
   */
  quotes?: Array<string | [string, string]>;

  /**
   * Argument separators.
   * A separator may be a single character or a string.
   */
  separators?: string[];

  /**
   * Flag markers mark the beginning of the command flag.
   */
  flagMarkers?: string[];

  /**
   * Flag value markers separate the flag value from the flag name.
   * E.g in "--flag = value" the equal sign is the flag value marker.
   */
  flagValueMarkers?: string[];

  /**
   * Empty argument markers used to mark argument with undefined value.
   */
  emptyArgMarkers?: string[];

  /**
   * Escape markers used to escape closing quotes in quoted arguments.
   * Also can be used to escape themselves.
   */
  escapeMarkers?: string[];

  /**
   * When the parser reaches a rest marker,
   * it parses the rest of the source as a string argument.
   */
  restMarkers?: string[];
}
