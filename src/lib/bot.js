const { Bot } = require("grammy");
const { telegram } = require("./config");

const bot = new Bot(telegram.botToken);

module.exports = bot;
