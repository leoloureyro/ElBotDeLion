// const BOT = require('./../lib/bot.js');
const HELPERS = require('./../lib/helpers.js');

// Respuestas de prefijo bf
const bfResponse = (message, req, BOT) => {
  let reqArr = req.split(" ");

  // Si no tiene elementos termina acá
  if(reqArr.length < 1){
    message.channel.send(HELPERS.getRandItem(BOT.customResponses.unknown));
    return false;
  }

  let request = require('request');
  let reqOptions;
  let params = {
    req: reqArr[0].trim(),
    players: []
  }
  for(let i = 1; i < reqArr.length; i++){
    params.players.push(reqArr[i].trim());
  }

  switch(params.req){
    case 'help':
    case 'ayuda':
      let helpMsg = `Para ver la lista de comandos completa leé mi docu en: *https://github.com/xtreme696/ElBotDeLion*`;
      message.channel.send(helpMsg);
      break;

    case 'leader':
    case 'lider':
      let leaderMsg = `Que lidere ${HELPERS.getRandItem(params.players)}`;
      message.channel.send(leaderMsg);
      break;

    case 'update':
    case 'actualizar':
      if(!params.players.length){
        message.channel.send(HELPERS.getRandItem(BOT.customResponses.unknown));
        return false;
      }

      message.channel.send(HELPERS.getRandItem(BOT.customResponses.waiting));

      reqOptions = {
        url: `https://battlefieldtracker.com/bf4/update/pc/${params.players[0]}`,
      };
      request(reqOptions, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          message.channel.send('Listo, hice lo que pude.. pero acordate que si las actualizaste hace poco puede que tengas que esperar unos minutos más antes de volver a hacerlo');
        } else {
          message.channel.send('No che, no pude.. no sé qué onda');
        }
      });
      break;

    case 'stats':
      if(!params.players.length){
        message.channel.send(HELPERS.getRandItem(BOT.customResponses.unknown));
        return false;
      }

      message.channel.send(HELPERS.getRandItem(BOT.customResponses.waiting));

      reqOptions = {
        url: `https://battlefieldtracker.com/bf4/stats/pc/${params.players[0]}`,
      };
      request(reqOptions, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let statsMap = bftStatsMap(body);
          if(statsMap === false){
            message.channel.send(HELPERS.getRandItem(BOT.customResponses.unfound));
            return false;
          }
          let newMessage = `score: ${statsMap.score}
rank: ${statsMap.rank}
kills: ${statsMap.kills}
K/D: ${statsMap.kd}
timePlayed: ${statsMap.timePlayed}
winRate: ${statsMap.winRate}
`;
          message.channel.send(newMessage);
        }
      });
      break;

    default:
      if(!params.players.length){
        message.channel.send(HELPERS.getRandItem(BOT.customResponses.unknown));
        return false;
      }

      message.channel.send(HELPERS.getRandItem(BOT.customResponses.waiting));

      reqOptions = {
        url: `https://battlefieldtracker.com/bf4/stats/pc/${params.players[0]}`,
      };
      request(reqOptions, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          let statsMap = bftStatsMap(body);
          if(statsMap === false){
            message.channel.send(HELPERS.getRandItem(BOT.customResponses.unfound));
            return false;
          }
          if(typeof(statsMap[params.req]) != 'undefined'){
            message.channel.send(`${params.req}: ${statsMap[params.req]}`);
          } else {
            message.channel.send('Sé que me preguntaste algo del battlefield pero sinceramente no entendí qué..');
          }
        }
      })

    return true;
  }
}

const bftStatsMap = doc => {
  let cheerio = require('cheerio');
  let $ = cheerio.load(doc);
  let stats = $('.pull-right');
  let statsMap;

  if(!$('.pull-right').text()){
    return false;
  } else {
    statsMap = {
      btrScore: stats.eq(2).text(),
      kills: stats.eq(3).text(),
      deaths: stats.eq(4).text(),
      assists: stats.eq(5).text(),
      kd: stats.eq(6).text(),
      games: stats.eq(7).text(),
      wins: stats.eq(8).text(),
      losses: stats.eq(9).text(),
      winRate: stats.eq(10).text(),
      rank: stats.eq(11).text(),
      timePlayed: stats.eq(12).text(),
      spm: stats.eq(13).text(),
      flagCaptures: stats.eq(14).text(),
      defendedFlags: stats.eq(15).text(),
      heals: stats.eq(16).text(),
      revives: stats.eq(17).text(),
      headshots: stats.eq(18).text(),
      shotsFired: stats.eq(19).text(),
      accuracy: stats.eq(20).text(),
      combatScore: stats.eq(21).text(),
      shotsHit: stats.eq(22).text(),
      avengerKills: stats.eq(23).text(),
      saviorKills: stats.eq(24).text(),
      killStreak: stats.eq(25).text(),
      scoreGeneral: stats.eq(26).text(),
      scoreTeam: stats.eq(27).text(),
      scoreUnlock: stats.eq(28).text(),
      scoreAward: stats.eq(29).text(),
      scoreBonus: stats.eq(30).text(),
      scoreSquad: stats.eq(31).text(),
      weapons: $('.col-xs-12.col-md-8').text().replace(/ /g, ""),
      topWeapons: $('.col-xs-12.col-md-8').text().replace(/ /g, ""),
      score: $('.col-sm-12 .text-warning').eq(0).text()
    }
  }

  return statsMap;
}

module.exports = {
  bfResponse
}
