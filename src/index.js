const bot = require("./lib/bot");
const botController = require("./bot-controller");

botController.assignController();

bot.start({ allowed_updates: ["message"] });
