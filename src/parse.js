import { RichParserStream } from "./RichParserStream";
import { DEFAULT_RICH_PARSER_OPTIONS } from "./options";

export function parse(sourceOrStream, options = {}) {
    const stream = sourceOrStream instanceof RichParserStream
        ? sourceOrStream
        : new RichParserStream(sourceOrStream, {
            ...DEFAULT_RICH_PARSER_OPTIONS,
            ...options
        });
    
    const parts = stream.parts();

    const args = parts.filter(part => typeof part != "object");
    const flags = parts.filter(part => typeof part == "object");
    
    return {
        args,
        flags: flagObject(flags, options.arrayFlagValues)
    };
}

function flagObject(flags, arrayFlagValues = true) {
    return (flags.map(flag => flag.name) |> [ ...new Set(#) ]).map(key => [
        key, flags.filter(flag => flag.name == key)
            .map(flag => flag.value)
            |> (#.length > 1
                ? (arrayFlagValues ? # : #[#.length - 1])
                : #[0]
            )
    ]).reduce((flags, [ key, value ]) => ({ ...flags, [key]: value }), {});
}