const { randomInt } = require("crypto");
const { usersId } = require("./lib/config");
const storage = require("./lib/storage");

class SantaModule {
    #randomizeUser(santaId) {
        const users = Object.keys(usersId);

        const santaIndex = users.indexOf(santaId + "");
        // Removing santa from pool
        users.splice(santaIndex, 1);

        const alreadyBusyUsers = Object.values(storage.getStorage().santas);

        for (const user of alreadyBusyUsers) {
            const userIndex = users.indexOf(user);

            if (~userIndex) {
                users.splice(userIndex, 1);
            }
        }

        const randomUserId = users.length ? randomInt(0, users.length) : 0;
        const user = users[randomUserId];

        return user;
    }

    async getIsEnd() {
        const store = storage.getStorage();

        const santasTotal = Object.keys(store.santas);
        const usersTotal = Object.keys(usersId);

        return {
            isEnd: santasTotal.length >= usersTotal.length,
            isNotified: store.isNotified,
            santasTotal,
            usersTotal,
        };
    }

    async setIsNotified() {
        const store = storage.getStorage();

        store.isNotified = true;

        storage.updateStorage();
    }

    /**
     *
     * @param {string | number} santaId
     * @returns
     */
    async rollUserForSanta(santaId) {
        const store = storage.getStorage();

        if (store.santas[santaId]) {
            return null;
        }

        const user = this.#randomizeUser(santaId);

        store.santas[santaId] = user;
        storage.updateStorage();

        return user;
    }

    /**
     *
     * @param {string | number} id
     * @param {string} text
     * @returns {Promise<boolean | null>}
     */
    async updateWish(id, text) {
        if (!usersId[id]) {
            return null;
        }

        const store = storage.getStorage();

        if (store.wishes[id] === text) {
            return false;
        }

        store.wishes[id] = text;
        storage.updateStorage();

        return true;
    }
}

const santaModule = new SantaModule();

module.exports = santaModule;
