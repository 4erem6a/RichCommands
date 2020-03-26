import { InputStream } from "./InputStream";
import { ParserOptions, Lexeme } from "./types/ParserOptions";
import {
  CommandPart,
  CommandFlag,
  CommandArgument,
  StringArgument,
  Command
} from "./types/types";

/**
 * The flag parsing mode.
 * @ignore
 */
const FLAG_MODE = Symbol("FLAG_MODE");

/**
 * Class for parsing commands.
 */
export class Parser {
  /**
   * The source input stream.
   */
  public readonly source: InputStream;

  /**
   * The parser options.
   */
  public readonly options: ParserOptions;

  /**
   * The parsing mode stack.
   */
  private modeStack: unknown[] = [];

  /**
   * @param source The source string.
   * @param options The parser options.
   */
  public constructor(source: string, options: ParserOptions);

  /**
   * @param source The source input stream.
   * @param options The parser options.
   */
  public constructor(source: InputStream, options: ParserOptions);

  public constructor(source: string | InputStream, options: ParserOptions) {
    this.source = source instanceof InputStream ? source : new InputStream(source);
    this.options = options;
  }

  /**
   * The current parsing mode.
   */
  private get mode(): unknown {
    return this.modeStack[this.modeStack.length - 1];
  }

  /**
   * Resets the parser state.
   */
  public reset(): void {
    this.source.reset();
  }

  /**
   * Matches the rest of the source and returns it as a string.
   */
  public matchRest(): StringArgument {
    const rest = this.source.rest;

    this.source.move(rest.length);

    return rest;
  }

  /**
   * Tries to parse a command.
   */
  public command(): Command | null {
    this.skipSeparators();

    const name = this.string();

    if (!name) {
      return null;
    }

    const parts = this.commandParts();

    return { name, parts };
  }

  /**
   * Parses command parts while the source is valid and the desired part count is not reached (if set).
   * @param count Number of parts to parse.
   */
  public commandParts(count?: number): CommandPart[] {
    const parts: CommandPart[] = [];

    while (this.source.isValid && (count == undefined || parts.length < count)) {
      const part = this.commandPart();

      if (part !== null) {
        parts.push(part);
      }
    }

    return parts;
  }

  /**
   * Tries to parse a command part.
   */
  public commandPart(): CommandPart | null {
    this.skipSeparators();

    return this.source.isValid ? this.flag() ?? this.argument() : null;
  }

  /**
   * Tries to parse a command flag.
   */
  public flag(): CommandFlag | null {
    const flagMarkers = this.options.flagMarkers ?? [];

    if (!this.source.matchLexeme(flagMarkers)) {
      return null;
    }

    this.skipSeparators();

    this.modeStack.push(FLAG_MODE);

    const name = this.string();

    this.modeStack.pop();

    if (!name) {
      return null;
    }

    this.skipSeparators();

    const valueMarkers = this.options.flagValueMarkers ?? [];

    const value = this.source.matchLexeme(valueMarkers)
      ? (this.skipSeparators(), this.argument())
      : true;

    return { name, value: value === null ? true : value };
  }

  /**
   * Tries to parse a command argument.
   */
  public argument(): CommandArgument | null {
    return this.rest() ?? this.quoted() ?? this.simpleOrEmpty();
  }

  /**
   * Tries to match a rest marker.
   * If matched, matches and returns the rest of the source as a string argument.
   * Otherwise, returns null.
   */
  public rest(): StringArgument | null {
    const restMarkers = this.options.restMarkers ?? [];

    if (this.source.matchLexeme(restMarkers)) {
      return this.matchRest();
    }

    return null;
  }

  /**
   * Tries to parse a string argument.
   */
  public string(): StringArgument | null {
    return this.quoted() ?? this.simple();
  }

  /**
   * Tries to parse a quoted string argument.
   */
  public quoted(): StringArgument | null {
    const opening = this.findPresentingOpeningQuote();

    if (!opening) {
      return null;
    } else {
      this.source.matchLexeme(opening);
    }

    const closing = this.getClosingQuote(opening);

    let current = this.source.current;
    let buffer = "";

    const escapes = this.options.escapeMarkers ?? [];

    while (!this.source.match(closing)) {
      if (!this.source.isValid) {
        return buffer;
      }

      const escape = this.source.findPresentingLexeme(escapes);

      if (escape) {
        const escapeLength =
          typeof escape == "string" ? escape.length : this.source.measureLexeme(escape);

        if (this.source.matchLexeme(closing, escapeLength)) {
          buffer += closing;
          this.source.move(-1);
        } else if (this.source.matchLexeme(escape, escapeLength)) {
          buffer += escape;
          this.source.move(-1);
        } else {
          buffer += current;
        }
      } else {
        buffer += current;
      }

      current = this.source.next;

      this.source.move(1);
    }

    return buffer;
  }

  /**
   * Tries to parse a simple or an empty argument.
   */
  public simpleOrEmpty(): CommandArgument | null {
    const emptyMarkers = this.options.emptyArgMarkers ?? [];

    const simple = this.simple();

    return simple && emptyMarkers.includes(simple) ? undefined : simple;
  }

  /**
   * Tries to parse a simple string argument (anything which is not a marker).
   */
  public simple(): StringArgument | null {
    const separators = this.options.separators ?? [];
    const valueMarkers = this.options.flagValueMarkers ?? [];

    let current = this.source.current;
    let buffer = "";

    while (
      this.source.isValid &&
      !this.source.matchLexeme(separators) &&
      !this.findPresentingOpeningQuote()
    ) {
      if (this.mode == FLAG_MODE && this.source.lookForLexeme(valueMarkers)) {
        break;
      }

      buffer += current;
      current = this.source.next;

      this.source.move(1);
    }

    return buffer || null;
  }

  /**
   * Returns the corresponding closing quote for the opening one.
   * @param opening The opening quote.
   */
  private getClosingQuote(opening: Lexeme): string {
    const quotes = this.options.quotes ?? [];

    const closingQuote = quotes.find(q => {
      q = Array.isArray(q) ? q[0] : q;

      return q == opening;
    }) as string;

    return Array.isArray(closingQuote) ? closingQuote[1] : closingQuote;
  }

  /**
   * Returns the opening quote presented at the current source position, if any.
   */
  private findPresentingOpeningQuote(): Lexeme | undefined {
    const quotes = this.options.quotes ?? [];

    const openingQuotes = quotes.map(q => (Array.isArray(q) ? q[0] : q));

    return this.source.findPresentingLexeme(openingQuotes);
  }

  /**
   * Skips all subsequent separators.
   */
  public skipSeparators(): void {
    const separators = this.options.separators ?? [];

    while (this.source.matchLexeme(separators));
  }
}
