const Redis = require('redis');
const Request = require('request');
var moment = require('moment'),
    tz = require('moment-timezone');

const SOCCER_API_URL = "http://soccer.sportsopendata.net/v1/",
      LEAGUE = "premier-league",
      TZONE = "Europe/Moscow";

class BotCache {

  constructor(options = {}) {
    //TODO: take ip and port from options
    //or use default
    this.client = Redis.createClient();
    this.client.on('error', function(err) {
      console.log("Error with redis: ", err);
    });

    this.rounds_key = "rounds_data";
    this.standings_key = "standings_data";

    this.init();
  }

  init() {
    this.setCacheIfNotExists(this.rounds_key, this.buildRoundsUrl());
    this.setCacheIfNotExists(this.standings_key, this.buildStandingsUrl());
  };

  setCacheIfNotExists(cache_key, urlForRequest) {
    var obj = this;
    this.client.exists(cache_key, function(err, reply) {
      if (reply != 1) {
        obj.getData(urlForRequest, function(body) {
          obj.client.set(cache_key, body);
        });
      }
    });
  };

  getData(url, callback) {
    Request(url, function(err, resp, body) {
      if (!err && resp.statusCode == 200) {
        callback(body);
      }
    });
  };

  buildRoundsUrl() {
    return SOCCER_API_URL + "leagues/" +
      LEAGUE + "/seasons/16-17/rounds";
  };

  buildStandingsUrl() {
    return SOCCER_API_URL + "leagues/" +
      LEAGUE + "/seasons/16-17/standings";
  };

  buildRoundUrl(roundSlug) {
    return SOCCER_API_URL + "leagues/" +
      LEAGUE + "/seasons/16-17/rounds/" +
      roundSlug;
  };

  getStandings(callback) {
    var bc = this;
    this.client.get(this.standings_key, function(err, reply) {
      if (reply != null) {
        callback(reply);
      } else {
        bc.getData(bc.buildStandingsUrl(), function(body) {
          bc.client.set(bc.standings_key, body);
          callback(body);
        });
      }
    });
  };

  getCurrentRound(callback) {
    var bc = this;
    this.getRounds(function(body) {
      var roundSlug = bc.getCurrentRoundSlug(JSON.parse(body).data.rounds);
      bc.getData(bc.buildRoundUrl(roundSlug), function(body) {
        callback(body);
      });
    });
  };

  getPreviousRound(callback) {
    var bc = this;
    this.getRounds(function(body) {
      var roundSlug = bc.getPreviousRoundSlug(JSON.parse(body).data.rounds);
      bc.getData(bc.buildRoundUrl(roundSlug), function(body) {
        callback(body);
      });
    });
  };

  getRounds(callback) {
    var bc = this;
    this.client.get(this.rounds_key, function(err, reply) {
      if (reply != null) {
        callback(reply);
      } else {
        bc.getData(bc.buildRoundsUrl(), function(body) {
          bc.client.set(bc.rounds_key, body);
          callback(body);
        });
      }
    });
  };

  getPreviousRoundSlug(rounds) {
    for (var i = 0; i < rounds.length; i++) {
      var el = rounds[i];
      var startDate = moment(el.start_date).tz(TZONE),
          endDate = moment(el.end_date).tz(TZONE),
          now = moment().tz(TZONE);
      if ( now > endDate ) { continue; }
      if ( (now >= startDate || now <= startDate) && now <= endDate ) {
        return rounds[i-1].round_slug;
      }
    }
  };

  getCurrentRoundSlug(rounds) {
    for (var i = 0; i < rounds.length; i++) {
      var el = rounds[i];
      var startDate = moment(el.start_date).tz(TZONE),
          endDate = moment(el.end_date).tz(TZONE),
          now = moment().tz(TZONE);
      if ( now > endDate ) { continue; }
      if ( (now >= startDate || now <= startDate) && now <= endDate ) {
        return el.round_slug;
      }
    }
  };
};


module.exports = BotCache;
