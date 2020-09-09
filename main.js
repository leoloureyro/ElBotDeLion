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


// MESSAGE HANDLER
client.on('message', message => {

  if(message.content.startsWith('!')){
    let messageTxt = message.content.slice(1).trim();
    BOT.handleResponse(BOT.handlePrefix(messageTxt), message);
  } else if((message.content.startsWith('-p') || message.content.startsWith('-P')) && Math.floor(Math.random() * 4) == 0){
    setTimeout(() => {
      message.channel.send(HELPERS.getRandItem(BOT.customResponses.badSong))
    }, 2500);
  }
});
