const config = require("./lib/config");
const santaModule = require("./santa");
const lang = require("../langs");
const storage = require("./lib/storage");
const bot = require("./lib/bot");
const { arrayShuffle, throwError } = require("./lib/helpers");

/**
 * @template {InferCtx<any>} X
 * @param {string} method
 * @param {(ctx: X) => any} func
 * @returns {(ctx: X) => any}
 */
function wrap(method, func) {
    return (ctx) => func(ctx).catch((err) => console.error(method, err));
}

class BotController {
    /** @type {NodeJS.Timeout | null} */
    #gameEndTimer = null;

    async notifyPLayers() {
        const { santas, wishes } = storage.getStorage();
        const users = Object.keys(santas);

        const targets = arrayShuffle(users);
        const lastTarget = targets[targets.length - 1] || throwError("Array is empty");

        for (let i = 0; i < targets.length - 1; i++) {
            const santa = targets[i];
            const target = targets[i + 1];

            santas[santa] = target;
        }

        santas[lastTarget] = targets[0];

        const promises = users.map((santa) => {
            const target = santas[santa];
            const targetUsername = config.usersId[target];

            const wish = wishes[target];
            const wishText = wish ? lang.wishText.replace("{wish}", wish) : "";

            let txt = lang.end.replace("{username}", targetUsername).replace("{wishText}", wishText);

            return bot.api.sendMessage(santa, txt);
        });

        await Promise.allSettled(promises).catch((err) => console.error("OnEnd", err));
    }

    /**
     *
     * @param {string | number} id
     * @returns {Promise<string | { msg: string; success: boolean }>}
     */
    async joinGame(id) {
        const username = config.usersId[id];

        if (!username) {
            console.warn("Unknown ID", id);

            return lang.sorry;
        }

        const isRegistered = await santaModule.registerUser(id);

        if (!isRegistered) {
            return lang.already;
        }

        console.log(username, "joined");

        return { msg: lang.welcome, success: true };
    }

    /**
     *
     * @param {string | number} id
     * @param {string} text
     * @returns {Promise<string>}
     */
    async updateWish(id, text) {
        const result = await santaModule.updateWish(id, text);

        if (result === null) {
            return lang.sorry;
        }

        return lang.wishUpdated;
    }

    async checkGameEnd() {
        const { isEnd, isNotified } = await santaModule.getIsEnd();
        if (this.#gameEndTimer) return;

        if (isEnd && !isNotified) {
            console.warn("Notify timer started!", config.timeForLastWishMin, "minutes");

            this.#gameEndTimer = setTimeout(async () => {
                await this.notifyPLayers();

                santaModule.setIsNotified();
            }, config.timeForLastWishMin * 60e3);
        }
    }

    assignController() {
        bot.command(
            "start",
            wrap("start", async (ctx) => {
                const result = await this.joinGame(ctx.chat.id);
                let message = "";

                if (typeof result === "object") {
                    message = result.msg;

                    await this.checkGameEnd();
                } else {
                    message = result;
                }

                await ctx.reply(message);
            })
        );

        bot.on(
            "message",
            wrap("wishUpdate", async (ctx) => {
                if (!ctx.message.text) return;

                const result = await this.updateWish(ctx.chat.id, ctx.message.text);

                await ctx.reply(result);
            })
        );
    }
}

// please dont blame me
const botController = new BotController();

module.exports = botController;
