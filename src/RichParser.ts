import { InputStream } from "@4erem6a/inputstream";
import { RichParserOptions } from "./RichParserOptions";
import {
  CommandPart,
  CommandFlag,
  CommandArgument,
  StringArgument
} from "./types/types";

const FLAG_MODE = Symbol("FLAG_MODE");

export class RichParser {
  public readonly source: InputStream;
  public readonly options: RichParserOptions;

  private modeStack: any[] = [];

  public constructor(source: string, options: RichParserOptions);
  public constructor(source: InputStream, options: RichParserOptions);
  public constructor(source: string | InputStream, options: RichParserOptions) {
    this.source =
      source instanceof InputStream ? source : new InputStream(source);
    this.options = options;
  }

  private get mode() {
    return this.modeStack[this.modeStack.length - 1];
  }

  public rest(): StringArgument {
    const rest = this.source.rest;

    this.source.move(rest.length);

    return rest;
  }

  public parts(count?: number): CommandPart[] {
    const parts: CommandPart[] = [];

    while (
      this.source.isValid &&
      (count == undefined || parts.length < count)
    ) {
      const part = this.part();

      if (part !== null) {
        parts.push(part);
      }
    }

    return parts;
  }

  public part(): CommandPart | null {
    this.skipSeparators();

    return this.flag() ?? this.argument();
  }

  public flag(): CommandFlag | null {
    const flagMarkers = this.options.flagMarkers ?? [];

    if (!this.source.match(flagMarkers)) {
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

    const value = this.source.match(valueMarkers)
      ? (this.skipSeparators(), this.argument())
      : true;

    return { name, value };
  }

  public argument(): CommandArgument {
    return this.quoted() ?? this.simpleOrEmpty();
  }

  public string(): StringArgument {
    return this.quoted() ?? this.simple();
  }

  public quoted(): StringArgument | null {
    const opening = this.findPresentingOpeningQuote();

    if (!opening) {
      return null;
    } else {
      this.source.match(opening);
    }

    const closing = this.getClosingQuote(opening);

    let current = this.source.current;
    let buffer = "";

    const escapes = this.options.escapeMarkers ?? [];

    while (!this.source.match(closing)) {
      if (!this.source.isValid) {
        return buffer;
      }

      const escape = this.source.findPresenting(escapes);

      if (escape) {
        if (this.source.match(closing, escape.length)) {
          buffer += closing;
          this.source.move(-1);
        } else if (this.source.match(escape, escape.length)) {
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

  public simpleOrEmpty(): CommandArgument {
    const emptyMarkers = this.options.emptyArgMarkers ?? [];

    const simple = this.simple();

    return emptyMarkers.includes(simple) ? undefined : simple;
  }

  public simple(): StringArgument {
    const separators = this.options.separators ?? [];
    const valueMarkers = this.options.flagValueMarkers ?? [];

    let current = this.source.current;
    let buffer = "";

    while (
      this.source.isValid &&
      !this.source.match(separators) &&
      !this.findPresentingOpeningQuote()
    ) {
      if (this.mode == FLAG_MODE && this.source.lookFor(valueMarkers)) {
        break;
      }

      buffer += current;
      current = this.source.next;

      this.source.move(1);
    }

    return buffer;
  }

  private getClosingQuote(opening: string): string {
    const quotes = this.options.quotes ?? [];

    const closingQuote = quotes.find(q => {
      q = Array.isArray(q) ? q[0] : q;

      return q == opening;
    }) as string;

    return Array.isArray(closingQuote) ? closingQuote[1] : closingQuote;
  }

  private findPresentingOpeningQuote(): string | undefined {
    const quotes = this.options.quotes ?? [];

    const openingQuotes = quotes.map(q => (Array.isArray(q) ? q[0] : q));

    return this.source.findPresenting(openingQuotes);
  }

  private skipSeparators(): void {
    const separators = this.options.separators ?? [];

    while (this.source.match(separators));
  }
}
