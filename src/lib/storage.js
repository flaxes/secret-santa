const fs = require("fs");
const { giftsFile } = require("../../config.json");

const realFile = `${giftsFile}.json`;

class Storage {
    /** @type {{ santas: Record<string, string>; wishes: Record<string, string>; isNotified?: boolean }} */
    #storage;

    constructor() {
        this.#storage = fs.existsSync(realFile)
            ? JSON.parse(fs.readFileSync(realFile, { encoding: "utf-8" }))
            : {
                  santas: {},
                  wishes: {},
              };

        this.updateStorage();
    }

    updateStorage() {
        fs.writeFileSync(realFile, JSON.stringify(this.#storage, null, 4));
    }

    getStorage() {
        return this.#storage;
    }
}

// please don't blame me
const storage = new Storage();

module.exports = storage;
