var TelegramBot = require('node-telegram-bot-api');

var token = process.env.FBOT_TOKEN;
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

bot.onText(/\/markup (.+)/, function(msg, match) {
  var resp = "1\tMan Utd\t\t\t30\n2\tMan City\t\t\t29\n"
  bot.sendMessage(msg.from.id, resp);
});

