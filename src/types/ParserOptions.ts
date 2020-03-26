/**
 * A value that a parser can match.
 */
export type Lexeme = string | RegExp;

/**
 * Options describing the command syntax for the {@link RichParser}.
 */
export interface ParserOptions {
  /**
   * Quoted argument markers.
   * A quote may be single ( " ) or paired ( {, } ).
   */
  quotes?: Array<Lexeme | [Lexeme, Lexeme]>;

  /**
   * Argument separators.
   * A separator may be a single character or a string.
   */
  separators?: Lexeme[];

  /**
   * Flag markers mark the beginning of the command flag.
   */
  flagMarkers?: Lexeme[];

  /**
   * Flag value markers separate the flag value from the flag name.
   * E.g in "--flag = value" the equal sign is the flag value marker.
   */
  flagValueMarkers?: Lexeme[];

  /**
   * Empty argument markers used to mark argument with undefined value.
   */
  emptyArgMarkers?: Lexeme[];

  /**
   * Escape markers used to escape closing quotes in quoted arguments.
   * Also can be used to escape themselves.
   */
  escapeMarkers?: Lexeme[];

  /**
   * When the parser reaches a rest marker,
   * it parses the rest of the source as a string argument.
   */
  restMarkers?: Lexeme[];
}
