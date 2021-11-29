// iostream-fs.test.js
//
// Tests for read and write streams that involve the actual interaction with the filesystem.
//

import { pipeline } from "stream/promises";

import Stream from "../../src/streams.js";
import Except from "../../src/except.js";

import { MockReadable, MockWritable } from "./mocks.js";

describe("Filesystem true errors", () => {
    describe("Input errors", () => {
        test("Input file doesn't exist", async () => {
            const inputStream = new Stream.Input("fake_input.txt");

            try {
                await pipeline(inputStream, new MockWritable());
            } catch (e) {
                expect(e).toBeInstanceOf(Except.InputFileError);
                expect(e.message).toMatch("ENOENT: no such file or directory, open");
                expect(e.message).toMatch("fake_input.txt");
            }
        });
    }); // Input errors

    describe("Output errors", () => {
        test("Output file doesn't exist", async () => {
            try {
                await pipeline(new MockReadable(""), new Stream.Output("fake_output.txt"));
            } catch (e) {
                expect(e).toBeInstanceOf(Except.OutputFileError);
                expect(e.message).toMatch("ENOENT: no such file or directory");
                expect(e.message).toMatch("fake_output.txt");
            }
        });

        test("Output is a directory", async () => {
            try {
                // assuming we're in the root directory of the app so checking
                // with the same 'test' directory which should exist
                await pipeline(new MockReadable("x"), new Stream.Output("test"));
            } catch (e) {
                expect(e).toBeInstanceOf(Except.OutputFileError);
                expect(e.message).toMatch("EISDIR: illegal operation on a directory");
            }
        });
    }); // Output errors
}); // Filesystem errors

//__EOF__
