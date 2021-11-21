// main.js

import { pipeline } from "stream";

import Options from "./src/options.js";
import Stream from "./src/streams.js";

let opts;
try {
    opts = new Options(process.argv.slice(2));
} catch (e) {
    // CLI options format error
    console.error(e.toString());
    console.error();
    Options.printUsage(process.argv);
    console.error();
    process.exit(1);
}

try {
    // create the array of encode-decode transform streams from the config specification
    let encdec = opts.config
        .split("-")
        .map((s) => s.trim())
        .map((cypher) => new Stream.EncodeDecode(cypher));

    let input = opts.input ? new Stream.Input(opts.input) : process.stdin;
    input.setEncoding("utf8");

    let output = opts.output ? new Stream.Output(opts.output) : process.stdout;
    output.setDefaultEncoding("utf8");

    pipeline(input, ...encdec, output, (e) => {
        if (e) {
            // filesystem operation error
            console.error(e.toString());
            console.error();
            setImmediate(() => process.exit(3));
        }
    });
} catch (e) {
    // cypher config errors are caught here
    console.error(e.toString());
    console.error();
    process.exit(2);
}

//__EOF__
