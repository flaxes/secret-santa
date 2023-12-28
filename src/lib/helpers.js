const { randomInt } = require("crypto");

/**
 * @template T
 * @param {T[]} array
 * @returns {T[]}
 */
module.exports.arrayShuffle = (array) => {
    // Duplicate array instead of changing provided one
    const newArray = array.slice(0);

    for (let i = array.length - 1; i > 0; i--) {
        // Non-cryptographic random! Avoid cases like that, especially for Santa game!
        // const j = Math.floor(Math.random() * (i + 1));

        // Cryptographic random. You're secrets are safe with it
        const j = Math.floor(randomInt(0, i + 1));

        // Some destruction trick
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
};

module.exports.throwError = (err) => {
    throw new Error(err);
};
