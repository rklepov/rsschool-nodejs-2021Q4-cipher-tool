// iostream-mock.test.js
//
// Tests for read and write streams using mocks of the fs calls (no actual filesystem access happening).
//

import * as fs from "fs";
import { pipeline } from "stream/promises";

import Stream from "../../src/streams.js";
import Except from "../../src/except.js";

import { MockReadable, MockWritable } from "./mocks.js";

// TODO: Check if it's possible do the same without mocking the whole fs module at once.
//       So far looks that there's some incompatibility with "import *" ESM statement so the simple jest.spyOn() calls
//       don't work without prior jest.mock("fs").
jest.mock("fs");

describe("Readable stream", () => {
    afterEach(() => {
        for (let f of ["open", "read", "close"]) {
            fs[f].mockReset();
        }
    });

    test("Input file read error", async () => {
        fs.open.mockImplementationOnce((path, flags /*, mode */, callback) => {
            setImmediate(() => callback(null, 0)); // 0 here prevents fs.close() to be called
        });

        fs.read.mockImplementationOnce((fd, buffer, offset, length, position, callback) => {
            setImmediate(() => callback(new Error("FAKE READ ERROR")));
        });

        const inputStream = new Stream.Input("fake_input.txt");

        try {
            await pipeline(inputStream, new MockWritable());
        } catch (e) {
            expect(fs.open).toHaveBeenCalledTimes(1);
            expect(fs.read).toHaveBeenCalledTimes(1);
            expect(e).toBeInstanceOf(Except.InputFileError);
            expect(e.message).toMatch("FAKE READ ERROR");
        }
    });

    test("Input file read success", async () => {
        const fakeFD = 999; // fs.close() will be called

        fs.open.mockImplementationOnce((path, flags /*, mode */, callback) => {
            setImmediate(() => callback(null, fakeFD));
        });

        const fakeFileContent = "+++ some fake file content ---";
        let readBuffer = fakeFileContent;
        fs.read.mockImplementation((fd, buffer, offset, length, position, callback) => {
            expect(fd).toBe(fakeFD);
            buffer.write(readBuffer, offset, length);
            callback(null, readBuffer.length, buffer);
            setImmediate(() => callback(null, readBuffer.length, buffer));
            readBuffer = "";
        });

        fs.close.mockImplementationOnce((fd, callback) => {
            expect(fd).toBe(fakeFD);
            callback(null);
        });

        const inputStream = new Stream.Input("filename_doesn't_matter.txt");
        const mockOutputStream = new MockWritable();
        await pipeline(inputStream, mockOutputStream);

        expect(fs.open).toHaveBeenCalledTimes(1);
        expect(fs.read).toHaveBeenCalledTimes(2);
        expect(mockOutputStream.buffer).toBe(fakeFileContent);
    });
});

describe("Writable stream", () => {
    afterEach(() => {
        for (let f of ["stat", "open", "write", "close"]) {
            fs[f].mockReset();
        }
    });

    test("Output file open error", async () => {
        fs.stat.mockImplementationOnce((path, callback) => {
            setImmediate(() => callback(null));
        });

        fs.open.mockImplementationOnce((path, flags /*, mode */, callback) => {
            setImmediate(() => callback(new Error("FAKE OUTPUT FILE OPEN ERROR")));
        });

        const outputStream = new Stream.Output("fake_output.txt");

        try {
            await pipeline(new MockReadable("x"), outputStream);
        } catch (e) {
            expect(fs.stat).toHaveBeenCalledTimes(1);
            expect(fs.open).toHaveBeenCalledTimes(1);
            expect(fs.open).toHaveBeenCalledTimes(1);

            expect(e).toBeInstanceOf(Except.OutputFileError);
            expect(e.message).toMatch("FAKE OUTPUT FILE OPEN ERROR");
        }
    });

    test("Output file write error", async () => {
        fs.stat.mockImplementationOnce((path, callback) => {
            setImmediate(() => callback(null));
        });

        fs.open.mockImplementationOnce((path, flags /*, mode */, callback) => {
            setImmediate(() => callback(null, 0)); // 0 here prevents fs.close() to be called
        });

        fs.write.mockImplementationOnce((fd, chunk, callback) => {
            setImmediate(() => callback(new Error("FAKE WRITE ERROR")));
        });

        const outputStream = new Stream.Output("fake_output.txt");

        try {
            await pipeline(new MockReadable("x"), outputStream);
        } catch (e) {
            expect(fs.stat).toHaveBeenCalledTimes(1);
            expect(fs.open).toHaveBeenCalledTimes(1);
            expect(fs.write).toHaveBeenCalledTimes(1);
            expect(e).toBeInstanceOf(Except.OutputFileError);
            expect(e.message).toMatch("FAKE WRITE ERROR");
        }
    });

    test("Output file write success", async () => {
        const fakeFD = 999;

        fs.stat.mockImplementationOnce((path, callback) => {
            setImmediate(() => callback(null));
        });

        fs.open.mockImplementationOnce((path, flags /*, mode */, callback) => {
            callback(null, fakeFD);
        });

        const fakeFileContent = "+++ some fake file content ---";
        fs.write.mockImplementation((fd, chunk, callback) => {
            expect(fd).toBe(fakeFD);
            expect(chunk).toBe(fakeFileContent);
            callback(null);
        });

        fs.close.mockImplementationOnce((fd, callback) => {
            expect(fd).toBe(fakeFD);
            callback(null);
        });

        const outputStream = new Stream.Output("filename_doesn't_matter.txt");
        await pipeline(new MockReadable(fakeFileContent), outputStream);

        for (let f of ["stat", "open", "write", "close"]) {
            expect(fs[f]).toHaveBeenCalledTimes(1);
        }
    });
});

//__EOF__
