const dotenv = require("dotenv");
dotenv.config();
const TASTEDIVE_API_KEY = process.env.TASTEDIVE_API_KEY;

const HELPERS = require('../lib/helpers.js');

class TasteDive {
  constructor(message, q = ''){
    this.message = message;

    this.key = TASTEDIVE_API_KEY;
    this.info = 1;
    this.limit = 5;
    this.type = '';

    this.qArr = q.split('--');
    this.q = encodeURIComponent(this.qArr[0].trim()).toLowerCase();

    if(this.qArr.length > 1){
      this.type = this.qArr[1].trim().toLowerCase();
    }

    if(q == ''){
      this.message.channel.send('Si querés que te recomiende algo pasame referencias separadas por coma..');
    } else {
      this.query();
    }
  }

  query(){
    let request = require('request');
    let options = {
      url: `https://tastedive.com/api/similar?q=${this.q}&info=${this.info}&limit=${this.limit}&type=${this.type}&k=${this.key}`
    };

    request(options, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let resObj = JSON.parse(body);

        if(!resObj.Similar.Results.length){
          this.message.channel.send('Jmmm no che.. me mataste..');
          return false;
        }

        let recom = HELPERS.getRandItem(resObj.Similar.Results);
        let botMessage = '';

        switch(recom.Type){
          case 'movie':
            botMessage += 'Y mirate ';
            break;
          case 'music':
            botMessage += 'Escuchate ';
            break;
          case 'book':
            botMessage += 'Capáz podés leer ';
            break;
          case 'game':
            botMessage += 'Jugá el ';
            break;
          default:
            botMessage += 'Fichate ';
            break;
        }

        botMessage += `**${recom.Name}**`;

        if(recom.hasOwnProperty('yUrl')){
          botMessage += "\n" + recom.yUrl.replace('-nocookie.com/embed/', '.com/watch?v=');
        } else if(recom.hasOwnProperty('wUrl')){
          botMessage += "\n" + recom.wUrl;
        }

        this.message.channel.send(botMessage);
      }
    });
  }
}

var pruebaVal = 2;

module.exports = {
  TasteDive,
  pruebaVal
}
