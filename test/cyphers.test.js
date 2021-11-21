// cyphers.test.js

// import { jest } from "@jest/globals";

import { CypherFactory } from "../src/cyphers.js";
import Except from "../src/except.js";

describe("Cyphers", () => {
    test("Incorrect cypher", () => {
        const f = () => {
            CypherFactory.create("Z");
        };
        expect(f).toThrow(Except.UnknownCypher);
        expect(f).toThrow("the following cypher is not yet supported: 'Z'");

        const g = () => {
            CypherFactory.create("XYZ123");
        };
        expect(g).toThrow(Except.UnknownCypher);
        expect(g).toThrow("the following cypher is not yet supported: 'XYZ123'");
    });

    describe("Caesar", () => {
        describe("Incorrect shift", () => {
            const cypherSpecs = ["C", "C9", "C012", "C123", "Cxyz"];

            test.each(cypherSpecs)("fails for incorrect spec '%j'", (spec) => {
                const f = () => {
                    CypherFactory.create(spec);
                };

                expect(f).toThrow(Except.IncorrectShiftSpec);
                expect(f).toThrow(`incorrect shift value has been provided for 'CaesarCypher': "${spec.slice(1)}"`);
            });
        }); // Incorrect shift

        describe("Encode", () => {
            const inputOutputStr = [
                ["abcdefghijklmnopqrstuvwxyz", "bcdefghijklmnopqrstuvwxyza"],
                ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "BCDEFGHIJKLMNOPQRSTUVWXYZA"],
                ["1234567890", "1234567890"],
                [
                    "abcdefghijklmnopqrstuvwxyz-1234567890-ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "bcdefghijklmnopqrstuvwxyza-1234567890-BCDEFGHIJKLMNOPQRSTUVWXYZA",
                ],
            ];

            test.each(inputOutputStr)("'%j' translates to '%j'", (from, to) => {
                const caesar = CypherFactory.create("C1");

                let result = caesar.applyTo(from);

                expect(result).toBe(to);
            });
        }); // Encode

        describe("Decode", () => {
            const inputOutputStr = [
                ["abcdefghijklmnopqrstuvwxyz", "zabcdefghijklmnopqrstuvwxy"],
                ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ZABCDEFGHIJKLMNOPQRSTUVWXY"],
                ["1234567890", "1234567890"],
                [
                    "abcdefghijklmnopqrstuvwxyz-1234567890-ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "zabcdefghijklmnopqrstuvwxy-1234567890-ZABCDEFGHIJKLMNOPQRSTUVWXY",
                ],
            ];

            test.each(inputOutputStr)("'%j' translates to '%j'", (from, to) => {
                const caesar = CypherFactory.create("C0");

                let result = caesar.applyTo(from);

                expect(result).toBe(to);
            });
        }); // Decode
    }); // Caesar

    describe("ROT8", () => {
        describe("Incorrect shift", () => {
            const cypherSpecs = ["R", "R9", "R012", "R123", "Rxyz"];

            test.each(cypherSpecs)("fails for incorrect spec '%j'", (spec) => {
                const f = () => {
                    CypherFactory.create(spec);
                };

                expect(f).toThrow(Except.IncorrectShiftSpec);
                expect(f).toThrow(`incorrect shift value has been provided for 'Rot8Cypher': "${spec.slice(1)}"`);
            });
        }); // Incorrect shift

        describe("Encode", () => {
            const inputOutputStr = [
                ["abcdefghijklmnopqrstuvwxyz", "ijklmnopqrstuvwxyzabcdefgh"],
                ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "IJKLMNOPQRSTUVWXYZABCDEFGH"],
                ["1234567890", "1234567890"],
                [
                    "abcdefghijklmnopqrstuvwxyz-1234567890-ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "ijklmnopqrstuvwxyzabcdefgh-1234567890-IJKLMNOPQRSTUVWXYZABCDEFGH",
                ],
            ];

            test.each(inputOutputStr)("'%j' translates to '%j'", (from, to) => {
                const rot8 = CypherFactory.create("R1");

                let result = rot8.applyTo(from);

                expect(result).toBe(to);
            });
        }); // Encode

        describe("Decode", () => {
            const inputOutputStr = [
                ["abcdefghijklmnopqrstuvwxyz", "stuvwxyzabcdefghijklmnopqr"],
                ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "STUVWXYZABCDEFGHIJKLMNOPQR"],
                ["1234567890", "1234567890"],
                [
                    "abcdefghijklmnopqrstuvwxyz-1234567890-ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "stuvwxyzabcdefghijklmnopqr-1234567890-STUVWXYZABCDEFGHIJKLMNOPQR",
                ],
            ];

            test.each(inputOutputStr)("'%j' translates to '%j'", (from, to) => {
                const caesar = CypherFactory.create("R0");

                let result = caesar.applyTo(from);

                expect(result).toBe(to);
            });
        }); // Decode
    }); // ROT8

    describe("Atbash", () => {
        describe("Incorrect shift", () => {
            const cypherSpecs = ["A1", "A0", "A012", "A123", "Axyz"];

            test.each(cypherSpecs)("fails for incorrect spec '%j'", (spec) => {
                const f = () => {
                    CypherFactory.create(spec);
                };

                expect(f).toThrow(Except.IncorrectShiftSpec);
                expect(f).toThrow(`incorrect shift value has been provided for 'AtbashCypher': "${spec.slice(1)}"`);
            });
        }); // Incorrect shift

        describe("EncodeDecode", () => {
            const inputOutputStr = [
                ["abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz".split("").reverse().join("")],
                ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reverse().join("")],
                ["1234567890", "1234567890"],
                [
                    "abcdefghijklmnopqrstuvwxyz-1234567890-ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                    "zyxwvutsrqponmlkjihgfedcba-1234567890-ZYXWVUTSRQPONMLKJIHGFEDCBA",
                ],
            ];

            test.each(inputOutputStr)("'%j' translates to '%j'", (from, to) => {
                const atbash = CypherFactory.create("A");

                let result = atbash.applyTo(from);

                expect(result).toBe(to);
            });
        }); // EncodeDecode
    }); // Atbash
});

//__EOF__
