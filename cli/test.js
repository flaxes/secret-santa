const { arrayShuffle, throwError } = require("../src/lib/helpers");

const abc = arrayShuffle([1, 2, 3, 4, 5, 6]);
const santas = {};

const targets = abc;
const lastTarget = targets[targets.length - 1] || throwError("Array is empty");

for (let i = 0; i < targets.length - 1; i++) {
    const santa = targets[i];
    const target = targets[i + 1];

    santas[santa] = target;
}

santas[lastTarget] = targets[0];

console.log(santas);
