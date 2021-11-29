// except.js

class Exception extends Error {
    get name() {
        return this.constructor.name;
    }
}

// CLI option errors ////////////////////

class CLIException extends Exception {}

class InvalidOption extends CLIException {
    constructor(opt) {
        super(`the following option is unexpected: '${opt}'`);
    }
}

class DuplicateOption extends CLIException {
    constructor(opt) {
        super(`the following option is duplicated: '${opt}'`);
    }
}

class MissingOption extends CLIException {
    constructor(opt) {
        super(`the following mandatory option(s) are missing: [${opt}]`);
    }
}

class MissingOptionValue extends CLIException {
    constructor(opt) {
        super(`the following option(s) are missing value(s): [${opt}]`);
    }
}

// Cypher config errors ////////////////////

class CypherSpecException extends Exception {}

class UnknownCypher extends CypherSpecException {
    constructor(spec) {
        super(`the following cypher is not yet supported: '${spec}'`);
    }
}

class IncorrectShiftSpec extends CypherSpecException {
    constructor(cypher, shift) {
        super(`incorrect shift value has been provided for '${cypher}': "${shift}"`);
    }
}

// Filesystem errors  ////////////////////

class FileError extends Exception {
    constructor(filename, message) {
        super(message);
        this.filename = filename;
    }
}

class InputFileError extends FileError {
    constructor(filename, message) {
        super(filename, message);
    }
}

class OutputFileError extends FileError {
    constructor(filename, message) {
        super(filename, message);
    }
}

export default {
    CLIException,
    InvalidOption,
    DuplicateOption,
    MissingOption,
    MissingOptionValue,

    CypherSpecException,
    UnknownCypher,
    IncorrectShiftSpec,

    FileError,
    InputFileError,
    OutputFileError,
};

//__EOF__
