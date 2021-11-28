// options.test.js

// import { jest } from "@jest/globals";

import Options from "../src/options.js";
import Except from "../src/except.js";

describe("CLI options", () => {
    describe("Incorrect input", () => {
        test("Duplicate --config", () => {
            const f = () => {
                new Options("-c C1 --config C0".split(" "));
            };
            expect(f).toThrow(Except.DuplicateOption);
            expect(f).toThrow("the following option is duplicated: '--config'");
        });

        test("Duplicate --input", () => {
            const f = () => {
                new Options("-i abc --input xyz".split(" "));
            };
            expect(f).toThrow(Except.DuplicateOption);
            expect(f).toThrow("the following option is duplicated: '--input'");
        });

        test("Duplicate --output", () => {
            const f = () => {
                new Options("-o abc --output xyz".split(" "));
            };
            expect(f).toThrow(Except.DuplicateOption);
            expect(f).toThrow("the following option is duplicated: '--output'");
        });

        test("Missing mandatory options", () => {
            const f = () => {
                new Options([]);
            };
            expect(f).toThrow(Except.MissingOption);
            expect(f).toThrow("the following mandatory option(s) are missing: [--config]");
        });

        test("Invalid option", () => {
            const f = () => {
                new Options("-c C1 xyz".split(" "));
            };
            expect(f).toThrow(Except.InvalidOption);
            expect(f).toThrow("the following option is unexpected: 'xyz");
        });

        test("Missing option value", () => {
            const f = () => {
                new Options("-i inp -c".split(" "));
            };
            expect(f).toThrow(Except.MissingOptionValue);
            expect(f).toThrow("the following option(s) are missing value(s): [--config]");
        });
    }); // Incorrect input

    describe("Correct input", () => {
        test("Correct short options passed", () => {
            // N.B.: the actual value of config option is not important here,
            // the validation is not performed at this stage
            const opts = new Options("-i a -o b -c c".split(" "));
            expect(opts.config).toBe("c");
            expect(opts.input).toBe("a");
            expect(opts.output).toBe("b");
            expect(opts.toString()).toBe("config: c, input: a, output: b");
        });

        test("Correct long options passed", () => {
            const opts = new Options("--input input --output output --config config".split(" "));
            expect(opts.config).toBe("config");
            expect(opts.input).toBe("input");
            expect(opts.output).toBe("output");
            expect(opts.toString()).toBe("config: config, input: input, output: output");
        });

        test("Correct mixed options passed", () => {
            const opts = new Options("-i inp --output output -c conf".split(" "));
            expect(opts.config).toBe("conf");
            expect(opts.input).toBe("inp");
            expect(opts.output).toBe("output");
            expect(opts.toString()).toBe("config: conf, input: inp, output: output");
        });

        test("Options order reshuffled", () => {
            const opts = new Options("-c conf -i inp --output output".split(" "));
            expect(opts.input).toBe("inp");
            expect(opts.output).toBe("output");
            expect(opts.config).toBe("conf");
            expect(opts.toString()).toBe("config: conf, input: inp, output: output");
        });
    }); // Correct

    describe("Various", () => {
        test("Usage print check", () => {
            // here we're not checking what exactly was printed to the output
            // just looking that no exceptions are thrown
            let onlyStringsPrinted = false;
            expect(
                Options.printUsage(["", ""], (...x) => {
                    onlyStringsPrinted = x.every((a) => "string" == typeof a);
                })
            ).toBe(undefined);
            expect(onlyStringsPrinted).toBe(true);
        });
    }); // Various
});

//__EOF__
