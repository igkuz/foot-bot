const moment = require('moment');
const tz = require('moment-timezone');
const TZONE = "Europe/Moscow";

class BotFormatter {
  constructor() {};

  formatStandings(teams) {
    var message = "```text\n";
        message += ["Pos", "Club\t", "Games", "Points"].join("\t\t\t") + "\n";
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
    
    return message;
  };

  formatRound(matches) {
    var message = "";
    var maxLength = matches.reduce(function(a, b) { 
      return (a.home_team.length + a.away_team.length + 3) > (b.home_team.length + b.away_team.length + 3) ?
        a : b;
    });
    for (i = 0; i < matches.length; i++) {
      var el = matches[i];
      message += i + "\t";
      message += el.home_team + " - " + el.away_team + "\t";
      if (el.played == 1) {
        message += el.match_result + "\t";
      };
      message += " ".repeat(
          (maxLength.away_team.length + maxLength.home_team.length - el.away_team.length - el.home_team.length)
      );
      message += moment(el.match_date).tz(TZONE).format("Do MMM YY HH:mm") + "\n";
    };

    return message;
  };

};

module.exports = BotFormatter;
