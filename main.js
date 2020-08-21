// DEPENDANCIES
const dotenv = require("dotenv");
dotenv.config();
const DISCORD_API_KEY = process.env.DISCORD_API_KEY;

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('El bot de Lion está ONLINE!');
});

client.login(DISCORD_API_KEY);


// BIN
const BOT = require('./bin/lib/bot.js');
const HELPERS = require('./bin/lib/helpers.js');
const BFT = require('./bin/controller/bft.js');


// MESSAGE HANDLER
client.on('message', message => {

  if(message.content.startsWith('!')){
    let messageTxt = message.content.slice(1).trim();
    let responseObj = BOT.validatePrefix(messageTxt);

    if(responseObj === false){
      message.channel.send(HELPERS.getRandItem(BOT.customResponses.unknown));
      return true;
    } else {
      handleResponse(responseObj, message);
      return true;
    }
  } else if((message.content.startsWith('-p') || message.content.startsWith('-P')) && Math.floor(Math.random() * 4) == 0){
    setTimeout(() => {
      message.channel.send(HELPERS.getRandItem(BOT.customResponses.badSong))
    }, 2500);
  }
});

// Identifica el tipo de prefijo y procesa el mensaje
const handleResponse = (obj, message) => {
  switch(obj.prefix){
    case 'bf':
      BFT.bfResponse(obj.message, message);
      break;
    case 'queonda':
      message.channel.send(HELPERS.getRandItem(BOT.customResponses.maySuggest));
      break;
    case 'hola':
    case 'buenas':
      message.channel.send(HELPERS.getRandItem(BOT.customResponses.greeting));
      break;
    case 'puto':
    case 'gato':
    case 'gay':
    case 'sorete':
    case 'gil':
      message.channel.send(`Más ${obj.prefix} serás vos.. re${obj.prefix}`);
      break;
  }
}
