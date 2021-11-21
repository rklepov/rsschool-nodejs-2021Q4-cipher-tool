// options.js

import path from "path";

import Except from "./except.js";

/**
 * The very basic implementation of command-line options parser for the set of hardcoded options specific for the task.
 *
 * TODO: eventually should migrate to the more advanced tool like minimist or commander for the CLI options parsing
 *       in the newer version.
 */
class Options {
    #config = null;
    #input = null;
    #output = null;

    constructor(argv) {
        for (let i = 0; i < argv.length; ++i) {
            switch (argv[i]) {
                case "-c":
                case "--config":
                    if (this.#config !== null) {
                        throw new Except.DuplicateOption(argv[i]);
                    }
                    this.#config = argv[i + 1];
                    ++i;
                    break;
                case "-i":
                case "--input":
                    if (this.#input !== null) {
                        throw new Except.DuplicateOption(argv[i]);
                    }
                    this.#input = argv[i + 1];
                    ++i;
                    break;
                case "-o":
                case "--output":
                    if (this.#output !== null) {
                        throw new Except.DuplicateOption(argv[i]);
                    }
                    this.#output = argv[i + 1];
                    ++i;
                    break;
                default:
                    throw new Except.InvalidOption(argv[i]);
            }
        }

        this.validate();
    }

    get config() {
        return this.#config;
    }

    get input() {
        return this.#input;
    }

    get output() {
        return this.#output;
    }

    validate() {
        // --config option needs to be provided
        if (null === this.#config) {
            throw new Except.MissingOption(["--config"]);
        }

        // if the option flag is provided then it should be followed by a value
        let missingValues = [
            // TODO: option names duplication with constructor
            { name: "--config", value: this.#config },
            { name: "--input", value: this.#input },
            { name: "--output", value: this.#output },
        ].filter((nv) => nv.value === undefined);
        if (0 < missingValues.length) {
            throw new Except.MissingOptionValue(missingValues.map((nv) => nv.name));
        }
    }

    toString() {
        return `config: ${this.config}, input: ${this.input}, output: ${this.output}`;
    }

    static printUsage(argv) {
        console.error("Usage:");
        console.error(
            path.basename(argv[0]),
            path.basename(argv[1]),
            '-c|--config "<config spec>"',
            "[ -i|--input <filename> ]",
            "[ -o|--output <filename> ]"
        );
    }
}

export default Options;

//__EOF__
