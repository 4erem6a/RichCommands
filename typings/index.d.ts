declare module "rich-commands" {
    export abstract class ParserStream {
        private modeStack: any[];
        protected position: number;

        public constructor(source: string);

        protected popMode(): void;
        protected pushMode(mode: any): void;
        protected get mode(): any;

        protected match(pattern: string, offset?: number): boolean;
        
        protected get next(): string;
        protected get current(): string;

        protected move(offset?: number): string;

        protected peek(offset?: number): string;

        protected is(search: string, offset?: number): boolean;

        protected substring(end?: number): string;

        protected isValid(offset?: number): boolean;

        protected isSome(search: string[], offset?: number): boolean;
        protected findPresenting(search: string[], offset?: number): string | undefined;

        protected matchSome(search: string[], offset?: number): boolean;
        protected findMatching(search: string[], offset?: number): string | undefined;
    }

    export interface RichParserOptions {
        readonly quotes: Array<string | [string, string]>;
        readonly separators: string[];
        readonly flagMarkers: string[];
        readonly flagValueMarkers: string[];
        readonly emptyArgMarkers: string[];
        readonly escapeMarkers: string[];
    }

    export const DEFAULT_RICH_PARSER_OPTIONS: RichParserOptions;

    export type CommandArgument = string;

    export interface CommandFlag {
        readonly name: string;
        readonly value?: string | true;
    }

    export type CommandPart = CommandArgument | CommandFlag;

    export class RichParserStream extends ParserStream {
        public constructor(source: string, options: RichParserOptions);

        public rest(): string;
        
        public part(): CommandPart | undefined;

        public flag(): CommandFlag | undefined;

        public argument(): CommandArgument | undefined;

        public string(): CommandArgument | undefined;

        public quoted(): CommandArgument | undefined;

        public simpleOrEmpty(): CommandArgument | undefined;

        public simple(): CommandArgument | undefined;

        private getClosingQuote(opening: string): string;

        private findPresentingQuote(offset?: number): string | undefined;

        private skipSeparators(): void;
    }

    export interface CommandFlags {
        readonly [name: string]: string | string[] | undefined;
    }

    export interface RichCommand {
        readonly args: string[];
        readonly flags: CommandFlags;
    }

    export interface ParseOptions {
        readonly argc?: number;
        readonly arrayFlagValues?: boolean;
    }

    export type PartialRichParserOptions = {
        readonly [P in keyof RichParserOptions]?: RichParserOptions[P]
    }

    export function parse(source: string): RichCommand;
    export function parse(source: string, options: ParseOptions & PartialRichParserOptions): RichCommand;
    export function parse(stream: RichParserStream): RichCommand;
    export function parse(stream: RichParserStream, options: ParseOptions): RichCommand;
}