// cyphers.js

import Except from "./except.js";

class Cypher {
    translate(char) {
        // 8. For encoding/decoding use only the English alphabet, all other characters should be kept untouched.
        let skip = true;

        let a, z;
        for (let [first, last] of [
            ["A", "Z"],
            ["a", "z"],
        ]) {
            if (first <= char && char <= last) {
                [skip, a, z] = [false, first, last];
                break;
            }
        }

        if (skip) return char;

        return this._translate(char, a, z, z.charCodeAt(0) - a.charCodeAt(0) + 1);
    }

    applyTo(str) {
        return Array.prototype.map.call(str, this.translate.bind(this)).join("");
    }
}

class ShiftingCypher extends Cypher {
    #shift = 0;

    constructor(shift) {
        super();
        this.#shift = shift;
    }

    _translate(char, a, z, cnt) {
        let code = ((char.charCodeAt(0) - a.charCodeAt(0) + this.#shift + cnt) % cnt) + a.charCodeAt(0);
        return String.fromCharCode(code);
    }
}

class CaesarCypher extends ShiftingCypher {
    constructor(shiftStr) {
        let shift = { 0: -1, 1: 1 }[shiftStr];
        if (!shift) {
            throw new Except.IncorrectShiftSpec(CaesarCypher.name, shiftStr);
        }
        super(shift);
    }
}

class Rot8Cypher extends ShiftingCypher {
    constructor(shiftStr) {
        let shift = { 0: -8, 1: 8 }[shiftStr];
        if (!shift) {
            throw new Except.IncorrectShiftSpec(Rot8Cypher.name, shiftStr);
        }
        super(shift);
    }
}

class AtbashCypher extends Cypher {
    constructor(shiftStr) {
        if (shiftStr) {
            throw new Except.IncorrectShiftSpec(AtbashCypher.name, shiftStr);
        }
        super();
    }

    _translate(char, a, z) {
        let code = z.charCodeAt(0) - char.charCodeAt(0) + a.charCodeAt(0);
        return String.fromCharCode(code);
    }
}

const cyphersSpec = {
    C: CaesarCypher,
    R: Rot8Cypher,
    A: AtbashCypher,
};

let CypherFactory = {
    create(spec) {
        let Ctor = cyphersSpec[spec[0]];
        if (Ctor) {
            return new Ctor(spec.slice(1)); // spec[1] undefined for "A" but that's fine
        } else {
            throw new Except.UnknownCypher(spec);
        }
    },
};

export { CypherFactory };

//__EOF__
