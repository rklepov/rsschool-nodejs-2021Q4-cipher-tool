// app.test.js

import main from "../src/app.js";

import Except from "../src/except.js";

describe("Main module tests", () => {
    test("Incorrect options result in output to stderr and non-zero exit code", () => {
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
});

//__EOF__
