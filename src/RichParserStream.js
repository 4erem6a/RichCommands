import { ParserStream } from "./ParserStream";

const modes = {
    flag: Symbol("FLAG_MODE")
};

export class RichParserStream extends ParserStream {
    constructor(source, options) {
        super(source);
        this.options = options;
    }

    rest() {
        const rest = this.substring();
        this.move(rest.length);
        return rest;
    }

    part() {
        this.skipSeparators();
        return this.isValid() && (
            this.flag() || this.argument()
        ) | undefined;
    }

    flag() {
        const { flagMarkers } = this.options;
        if (!this.matchSome(flagMarkers)) {
            return;
        }
        this.skipSeparators();
        this.pushMode(modes.flag);
        const name = this.string();
        this.popMode();
        this.skipSeparators();
        const { flagValueMarkers } = this.options;
        const value = this.matchSome(flagValueMarkers)
            ? (this.skipSeparators(), this.argument())
            : true;
        return { name, value };
    }

    argument() {
        return this.quoted() || this.simpleOrEmpty();
    }

    string() {
        return this.quoted() || this.simple();
    }

    quoted() {
        const opening = this.findPresentingOpeningQuote();
        if (!opening) {
            return;
        } else { this.match(opening); }
        const closing = this.getClosingQuote(opening);
        let { current } = this, buffer = "";
        const { escapeMarkers } = this.options;
        while (!this.match(closing)) {
            if (!this.isValid()) {
                return buffer;
            }
            const escape = this.findPresenting(escapeMarkers);
            if (escape) {
                if (this.match(closing, escape.length)) {
                    buffer += closing;
                    this.move(-1);
                } else if (this.match(escape, escape.length)) {
                    buffer += escape;
                    this.move(-1);
                } else {
                    buffer += current;
                }
            } else {
                buffer += current;
            }
            current = this.next;
        }
        return buffer;
    }

    simpleOrEmpty() {
        const { emptyArgMarkers } = this.options;
        const simple = this.simple();
        return emptyArgMarkers.includes(simple)
            ? undefined
            : simple;
    }

    simple() {
        const { separators, flagValueMarkers } = this.options;
        let { current } = this, buffer = "";
        while (
            this.isValid() &&
            !this.matchSome(separators) &&
            !this.findPresentingOpeningQuote()
        ) {
            if (this.mode == modes.flag && this.isSome(flagValueMarkers)) {
                break;
            }
            buffer += current;
            current = this.next;
        }
        return buffer;
    }

    getClosingQuote(opening) {
        const { quotes } = this.options;
        return quotes.find(q => q
            |> (Array.isArray(#) ? #[0] : #)
            |> # == opening
        ) |> (Array.isArray(#) ? #[1] : #);
    }

    findPresentingOpeningQuote() {
        const { quotes } = this.options;
        return quotes.map(q => Array.isArray(q) ? q[0] : q)
            |> this.findPresenting(#);
    }

    skipSeparators() {
        const { separators } = this.options;
        // eslint-disable-next-line curly
        while (this.matchSome(separators));
    }
}