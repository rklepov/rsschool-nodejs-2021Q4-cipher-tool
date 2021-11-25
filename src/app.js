// app.js

import { pipeline } from "stream/promises";

import Options from "./options.js";
import Stream from "./streams.js";

async function run(opts) {
    try {
        // create the array of encode-decode transform streams from the config specification
        let encdec = Stream.EncodeDecode.createFromConfig(opts.config);

        let input = opts.input ? new Stream.Input(opts.input) : process.stdin;
        input.setEncoding("utf8");

        let output = opts.output ? new Stream.Output(opts.output) : process.stdout;

        await pipeline(input, ...encdec, output);
    } catch (e) {
        // cypher config errors and filesystem operation errors are caught here
        console.error(e.toString());
        console.error();
        process.exit(2); // TODO: different exit code for the different kinds of errors
    }
}

function main(argv) {
    try {
        run(new Options(argv.slice(2)));
    } catch (e) {
        // CLI options format error
        console.error(e.toString());
        console.error();
        Options.printUsage(argv.slice(0, 2), (...msg) => console.error(...msg));
        console.error();
        process.exit(1);
    }
}

export default main;

//__EOF__
