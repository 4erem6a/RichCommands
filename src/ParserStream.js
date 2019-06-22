export class ParserStream {
    modeStack = [];
    position = 0;

    constructor(source) {
        this.source = source;
    }

    pushMode(mode) {
        this.modeStack.push(mode);
    }

    popMode() {
        return this.modeStack.pop();
    }

    get mode() {
        return this.modeStack[this.modeStack.length - 1];
    }

    match(pattern, offset = 0) {
        const starts = this.is(pattern, offset);
        if (starts) {
            this.position += pattern.length + offset;
        }
        return starts;
    }

    get next() {
        return this.move(1);
    }

    get current() {
        return this.peek();
    }

    move(offset = 1) {
        this.position += offset;
        return this.peek();
    }

    peek(offset = 0) {
        return this.isValid(offset)
            ? this.source[this.position + offset]
            : "";
    }

    is(search, offset = 0) {
        return this.source.startsWith(search, this.position + offset);
    }

    substring(end = undefined) {
        return this.source.substring(this.position, end);
    }

    isValid(offset = 0) {
        return this.position + offset
            |> # >= 0 && # < this.source.length;
    }

    isSome(search, offset = 0) {
        return search.some(s => this.is(s, offset));
    }

    findPresenting(search, offset = 0) {
        return search.find(s => this.is(s, offset));
    }

    matchSome(search, offset = 0) {
        return search.some(s => this.match(s, offset));
    }

    findMatching(search, offset = 0) {
        return search.find(s => this.match(s, offset));
    }
}