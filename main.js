// DEPENDANCIES
const dotenv = require("dotenv");
dotenv.config();
const DISCORD_API_KEY = process.env.DISCORD_API_KEY;

const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
  console.log('El bot de Lion está ONLINE!');
  rolesAssign()
    .catch(console.error);
});

client.login(DISCORD_API_KEY);


// BIN
const BOT = require('./bin/lib/bot.js');
const HELPERS = require('./bin/lib/helpers.js');


// TEXT MESSAGE HANDLER
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

// VOICE CHANNEL UPDATES
client.on('voiceStateUpdate', (oldState, newState) => {
  let newUserChannel = newState.channel,
      oldUserChannel = oldState.channel;

  if(newUserChannel != undefined) {
    for(let game of BOT.gamesCollection){
      if(newUserChannel.id == game.channel){
        let txtChannel = newState.guild.channels.cache.get('823479421515595836');
        // txtChannel = newState.guild.channels.cache.get('822189945842040883'); // DEBUG
        txtChannel.send(`<@${newState.member.user.id}> está viciando ${newUserChannel.name}.. algún <@&${game.role}> para sumarse?`);
      }
    }
  }

  // Count voiceChannels active members from 688423469502693425
  const guild = newState.guild;
  let connectedUsers = 0;
  for(let channel of guild.channels.cache){
    if(channel[1].parentID == '688423469502693425'){
      connectedUsers += channel[1].members.array().length;
    }
  }
  let countingChannel = guild.channels.resolve('823628770102870046');
  countingChannel.setName(`🎮 ${connectedUsers} Jugando`, 'Porque necesitamos contar cuántos están activos')
    .catch(console.error);
});

// ASSIGN GAME ROLES
async function rolesAssign(){
  // FA!Fetch
  const guild = await client.guilds.fetch('688423468844580895'),
        channel = await guild.channels.resolve('823213149359702047').fetch(),
        message = await channel.messages.fetch('823221158051708938');

  const filter = reaction => {
    for(let g of BOT.gamesCollection){
      if(reaction.emoji.name == g.emoji) return true
    }
    return false;
  }
  const collector = message.createReactionCollector(filter);

  collector.on('collect', async (reaction, user) => {
    for(let game of BOT.gamesCollection){
      if(reaction.emoji.name == game.emoji){
        const newRole = guild.roles.cache.get(game.role);
        const thisUser = guild.members.cache.get(user.id);

        thisUser.roles.add(newRole).catch(console.error);
      }
    }
  });
}
