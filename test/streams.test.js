// streams.test.js

// import { jest } from "@jest/globals";

import Stream from "../src/streams.js";
import Except from "../src/except.js";

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
});

//__EOF__
