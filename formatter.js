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

};

module.exports = BotFormatter;
