// app.test.js

import main from "../src/app.js";

import Except from "../src/except.js";

describe("Main module tests", () => {
    test("Incorrect options format: message printed to stderr and process exits with non-zero code", () => {
        let consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
        let processExit = jest.spyOn(process, "exit").mockImplementation((status) => {
            expect(status).toBeGreaterThan(0);
        });

        try {
            main(["node", "main"]);
        } catch (e) {
            expect.assertions(4);
            expect(consoleError).toHaveBeenCalledTimes(4);
            expect(processExit).toHaveBeenCalledTimes(1);
            expect(e).toBeInstanceOf(Except.CLIException);
        }
    });

    test.todo("Runtime error: message printed to stderr and process exits with non-zero code");
});

//__EOF__
