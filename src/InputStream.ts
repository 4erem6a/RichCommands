import { InputStream as _InputStream } from "@4erem6a/inputstream";
import { Lexeme } from "./types/ParserOptions";

/**
 * Utility class for string analysis.
 */
export class InputStream extends _InputStream {
  /**
   * Makes a regexp match from the start of the string if it's not.
   * @param regexp A regexp to normalize.
   */
  public static normalizeRegexp(regexp: RegExp): RegExp {
    if (regexp.source.startsWith("^")) {
      return regexp;
    }

    return new RegExp(`^${regexp.source}`, regexp.flags);
  }

  /**
   * Tries to match a lexeme.
   * @param lexeme A lexeme or an array of lexemes to match.
   * @param offset Matching position offset.
   */
  public matchLexeme(lexeme: Lexeme | Lexeme[], offset?: number): boolean {
    if (Array.isArray(lexeme)) {
      return lexeme.some(lexeme => this.matchLexeme(lexeme, offset));
    }

    if (typeof lexeme == "string") {
      return this.match(lexeme, offset);
    }

    const match = this.matchRegExp(InputStream.normalizeRegexp(lexeme), offset);

    if (match?.[0]) {
      this.move(match[0].length);
      return true;
    }

    return false;
  }

  /**
   * Looks whether a lexeme of any of lexemes is present at the current position.
   * @param lexeme A lexeme or an array of lexemes to look for.
   * @param offset Matching position offset.
   */
  public lookForLexeme(lexeme: Lexeme | Lexeme[], offset?: number): boolean {
    if (Array.isArray(lexeme)) {
      return lexeme.some(lexeme => this.lookForLexeme(lexeme, offset));
    }

    if (typeof lexeme == "string") {
      return this.lookFor(lexeme);
    }

    return this.testFor(InputStream.normalizeRegexp(lexeme), offset);
  }

  /**
   * Returns the first matching lexeme from an array or undefined.
   * @param lexemes An array of lexemes to search in.
   * @param offset Matching position offset.
   */
  public findMatchingLexeme(lexemes: Lexeme[], offset?: number): Lexeme | undefined {
    return lexemes.find(lexeme => this.matchLexeme(lexeme, offset));
  }

  /**
   * Returns the first lexeme from an array that is present at the current position.
   * @param lexemes An array of lexemes to search in.
   * @param offset Matching position offset.
   */
  public findPresentingLexeme(lexemes: Lexeme[], offset?: number): Lexeme | undefined {
    return lexemes.find(lexeme => this.lookForLexeme(lexeme, offset));
  }

  /**
   * Returns the length of a lexeme or 0 if it's not present.
   * @param lexeme A lexeme to measure.
   * @param offset Matching position offset.
   */
  public measureLexeme(lexeme: Lexeme, offset?: number): number {
    if (typeof lexeme == "string") {
      return this.lookFor(lexeme) ? lexeme.length : 0;
    }

    const match = this.matchRegExp(lexeme, offset);

    return match?.[0]?.length ?? 0;
  }
}
