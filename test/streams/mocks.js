// streams/mocks.js

import { Readable, Writable } from "stream";

/**
 * Fake implementation of a writable stream which collects the data in the internal buffer.
 */
class MockWritable extends Writable {
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

    _read(/* n */) {
        this.push(this.text);
        this.push(null);
    }

    _destroy(err, callback) {
        callback(err);
    }
}

export { MockReadable, MockWritable };

//__EOF__
