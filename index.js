var TelegramBot = require('node-telegram-bot-api'),
    request = require('request'),
    BotFormatter = require('./formatter.js'),
    BotCache = require('./cache.js');

const MARKDOWN = "Markdown";

var token = process.env.FBOT_TOKEN;
// Setup polling way
var bot = new TelegramBot(token, {polling: { interval: 2000, timeout: 65}});
var bc = new BotCache();
var bf = new BotFormatter();

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

bot.onText(/\/standings/, function(msg, match) {
  bc.getStandings(function(body) {
    var message = bf.formatStandings(JSON.parse(body)["data"]["standings"]);
    bot.sendMessage(msg.from.id, message, {parse_mode: MARKDOWN});
  });
});

bot.onText(/\/currentRound/, function(msg, match) {
  bc.getCurrentRound(function(body) {
    var message = bf.formatRound(JSON.parse(body).data.rounds[0].matches)
    bot.sendMessage(msg.from.id, message, {parse_mode: MARKDOWN});
  });
});

bot.onText(/\/prevRound/, function(msg, match) {
  bc.getPreviousRound(function(body) {
    var message = bf.formatRound(JSON.parse(body).data.rounds[0].matches);
    bot.sendMessage(msg.from.id, message, {parse_mode: MARKDOWN});
  });
});

bot.onText(/\/mak/, function(msg, match) {
  bot.sendMessage(msg.from.id, "Мак – дно, МЮ чемпион");
});
