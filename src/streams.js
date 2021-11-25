// streams.js

import * as fs from "fs";
import { Readable, Writable, Transform } from "stream";

import { CypherFactory } from "./cyphers.js";
import Except from "./except.js";

/**
 * Input file stream.
 *
 * The implementation is basically copied from the respective example in Node.js doc
 * https://nodejs.org/api/stream.html#readable_constructcallback
 */
class Input extends Readable {
    constructor(filename) {
        super({ encoding: "utf8" }); // TODO: input expects text file with fixed encoding only
        this.filename = filename;
        this.fd = null;
    }

    _construct(callback) {
        fs.open(this.filename, "r", (err, fd) => {
            if (err) {
                callback(new Except.InputFileError(this.filename, err.message));
            } else {
                this.fd = fd;
                callback();
            }
        });
    }

    _read(n) {
        const buf = Buffer.alloc(n);
        fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
            if (err) {
                this.destroy(new Except.InputFileError(this.filename, err.message));
            } else {
                this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null, this.readableEncoding);
            }
        });
    }

    _destroy(err, callback) {
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err)); // ? no special error handling on close
        } else {
            callback(err);
        }
    }
}

/**
 * Output file stream.
 *
 * The implementation is basically copied from the respective example in Node.js doc
 * https://nodejs.org/api/stream.html#writable_constructcallback
 */
class Output extends Writable {
    constructor(filename) {
        super({ decodeStrings: false, defaultEncoding: "utf8" }); // TODO: writes text in fixed encoding only
        this.filename = filename;
    }

    _construct(callback) {
        // according to the requirement the output file should exist
        //
        // TODO: change to async/await instead of nested callbacks
        fs.stat(this.filename, (err) => {
            if (err) {
                callback(new Except.OutputFileError(this.filename, err.message));
            } else {
                fs.open(this.filename, "a", (err, fd) => {
                    if (err) {
                        callback(new Except.OutputFileError(this.filename, err.message));
                    } else {
                        this.fd = fd;
                        callback();
                    }
                });
            }
        });
    }

    _write(chunk, encoding, callback) {
        fs.write(this.fd, chunk, (err) => {
            if (err) {
                callback(new Except.OutputFileError(this.filename, err.message));
            } else {
                callback(null);
            }
        });
    }

    _destroy(err, callback) {
        // TODO: the code is duplicated with Input class function of the same name
        if (this.fd) {
            fs.close(this.fd, (er) => callback(er || err)); // ? no special error handling on close
        } else {
            callback(err);
        }
    }
}

/**
 * The transform stream for strings encoding and decoding.
 * Delegates the actual character translation to the embedded cypher object.
 */
class EncodeDecode extends Transform {
    #cypher = null;

    constructor(cypher_spec) {
        super({ decodeStrings: false, encoding: "utf8" });
        this.#cypher = CypherFactory.create(cypher_spec);
    }

    _transform(chunk, encoding, callback) {
        let output = this.#cypher.applyTo(chunk);
        callback(null, output);
    }

    /**
     * Returns an array of encode-decode transform streams created from the
     * cyphers config spec (oroginally passed via --config CLI option).
     *
     * @param {string} cyphers config spec
     */
    static createFromConfig(config) {
        return config
            .split("-")
            .map((s) => s.trim())
            .map((cypher) => new EncodeDecode(cypher));
    }
}

export default { Input, Output, EncodeDecode };

//__EOF__
