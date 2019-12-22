export class ParserStream {
  private modeStack: any[] = [];
  private _position: number = 0;

  public constructor(public readonly source: string) {}

  public pushMode(mode: any): void {
    this.modeStack.push(mode);
  }

  public popMode(): any {
    return this.modeStack.pop();
  }

  public get mode(): any {
    return this.modeStack[this.modeStack.length - 1];
  }

  public get position(): number {
    return this._position;
  }

  public move(offset: number): string {
    this._position += offset;

    return this.current;
  }

  public checkSourceBounds(offset: number): boolean {
    const position = this._position + offset;

    return position >= 0 && position < this.source.length;
  }

  public get isValid(): boolean {
    return this.checkSourceBounds(0);
  }

  public peek(offset: number): string {
    return this.checkSourceBounds(offset)
      ? this.source[this._position + offset]
      : "";
  }

  public get current(): string {
    return this.peek(0);
  }

  public get next(): string {
    return this.peek(1);
  }

  public lookFor(lexeme: string | string[], offset: number = 0): boolean {
    if (Array.isArray(lexeme)) {
      return lexeme.some(t => this.lookFor(t, offset));
    } else {
      return this.source.startsWith(lexeme, this._position + offset);
    }
  }

  public match(lexeme: string | string[], offset: number = 0): boolean {
    if (Array.isArray(lexeme)) {
      return lexeme.some(t => this.match(t, offset));
    } else {
      const matches = this.lookFor(lexeme, offset);

      if (matches) {
        this.move(lexeme.length + offset);
      }

      return matches;
    }
  }

  public findExisting(
    lexemes: string[],
    offset: number = 0
  ): string | undefined {
    return lexemes.find(l => this.lookFor(l, offset));
  }

  public findMatching(
    lexemes: string[],
    offset: number = 0
  ): string | undefined {
    return lexemes.find(l => this.match(l, offset));
  }
}
