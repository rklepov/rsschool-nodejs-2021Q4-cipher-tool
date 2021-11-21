// streams.test.js

import { jest } from "@jest/globals";

import { Readable, Writable } from "stream";
import { pipeline } from "stream/promises";

import Stream from "../src/streams.js";
import Except from "../src/except.js";

/**
 * Fake implementation of a writable stream which collects the data in the
 * internal buffer.
 */
class MockWriteable extends Writable {
    constructor() {
        super({ decodeStrings: false, defaultEncoding: "utf8" });
        this.buffer = "";
    }

    _construct(callback) {
        callback();
    }

    _write(chunk, _, callback) {
        this.buffer += chunk;
        callback();
    }
}

/**
 * Fake implementation of a readable stream which publishes the fixed text.
 */
class MockReadable extends Readable {
    constructor(text) {
        super({ encoding: "utf8" });
        this.text = text;
    }

    _construct(callback) {
        callback();
    }

    _read(n) {
        this.push(this.text);
        this.push(null);
    }

    _destroy(err, callback) {
        callback(err);
    }
}

describe("Transform stream", () => {
    describe("Incorrect config", () => {
        const config = [
            ["C1-C0-X1-A", "UnknownCypher", "the following cypher is not yet supported: 'X1'"],
            ["C1-C0-C2-A", "IncorrectShiftSpec", "incorrect shift value has been provided for 'CaesarCypher': \"2\""],
            ["C1-C0-C1-A1", "IncorrectShiftSpec", "incorrect shift value has been provided for 'AtbashCypher': \"1\""],
        ];

        test.each(config)("incorrect config passed: %j", (spec, e, msg) => {
            const f = () => {
                return Stream.EncodeDecode.createFromConfig(spec);
            };
            expect(f).toThrow(Except[e]);
            expect(f).toThrow(msg);
        });
    }); // Incorrect config

    describe("Usage examples", () => {
        const configOutput = [
            ["C1-C1-R0-A", 'Myxn xn nbdobm. Tbnnfzb ferlm "_" nhteru!'],
            ["C1-C0-A-R1-R0-A-R0-R0-C1-A", 'Vhgw gw wkmxkv. Ckwwoik onauv "_" wqcnad!'],
            ["A-A-A-R1-R0-R0-R0-C1-C1-A", 'Hvwg wg gsqfsh. Asggous opcih "_" gmapcz!'],
            ["C1-R1-C0-C0-A-R0-R1-R1-A-C1", 'This is secret. Message about "_" symbol!'],
        ];

        test.each(configOutput)("Correct config passed: %j", async (spec, output) => {
            const mockReadStream = new MockReadable('This is secret. Message about "_" symbol!');
            const mockWriteStream = new MockWriteable();
            let encdec = Stream.EncodeDecode.createFromConfig(spec);

            await pipeline(mockReadStream, ...encdec, mockWriteStream);

            expect(mockWriteStream.buffer).toBe(output);
        });
    });
});

//__EOF__
