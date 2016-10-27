var TelegramBot = require('node-telegram-bot-api'),
    request = require('request');

var token = process.env.FBOT_TOKEN;
// Setup polling way
var bot = new TelegramBot(token, {polling: { interval: 2000, timeout: 65}});

// Matches /echo [whatever]
bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

bot.onText(/\/standings/, function(msg, match) {
  getStandingMessage(function(message) {
    bot.sendMessage(msg.from.id, message, {parse_mode: "Markdown"});
  });
});

bot.onText(/\/mak/, function(msg, match) {
  bot.sendMessage(msg.from.id, "Мак – дно, МЮ чемпион");
});

function getStandingMessage(callback) {
  var teams = [];
  var message = "```text\n";
      message += ["Pos", "Club\t", "Games", "Points"].join("\t\t\t") + "\n";

  var standinsUrl = 'http://soccer.sportsopendata.net/v1/leagues/premier-league/seasons/16-17/standings';
  request(standinsUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      teams = JSON.parse(body)['data']['standings'];

      var maxLength = teams.reduce(function(a, b) { return a.team.length > b.team.length ? a : b; });

      teams.forEach(function(element) {
        element.team += " ".repeat((maxLength.team.length - element.team.length));
        if (element.position < 10) {
          element.position += " "
        };

        if (element.overall.points < 10) {
          element.overall.points = " " + element.overall.points
        }

        message += [element.position, element.team, element.overall.matches_played, element.overall.points].join("\t");
        message += "\n";
      });
      message += "```";

      callback(message);
    }
  });
}
