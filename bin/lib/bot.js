const HELPERS = require('./helpers.js');
const BFT = require('../controller/bft.js');
const tasteDive = require('../controller/taste-dive.js');

const customResponses = {
  greeting: [
    'K c',
    'Buenas',
    'Cómo va?',
    'Qué onda?',
    'Todo piola?',
    'Qué acelga mate',
    'Hola gato'
  ],
  unknown: [
    'Nah no tentendí ná de lo que dijiste',
    'Ponele...',
    'Lo qué?',
    'Aprendé a escribir capo',
    'Bancá que le pregunto al de verdad...',
    'No te entendí un carajo'
  ],
  waiting: [
    'A ve...',
    'Ya te digo',
    'Jmmm',
    'Bancá',
    '..'
  ],
  maySuggest: [
    'Capo capo.. lo banco',
    'Naaaah tremendo gil ese',
    'Y... ahí andará.. qué se yo',
    'Macho alfa gorila espalda plateada',
    'Regay',
    'Jajajajaja alto puto cagaleche'
  ],
  unfound: [
    'No eh.. no lo estaría encontrando...',
    'No encontré nada',
    'No che.. nada'
  ],
  badSong: [
    'Pero qué tema de puto eh..',
    'Naaah no me pongas eso',
    'Buo.. música más gay no, no?',
    'DJ poronga',
    'Posta van a viciar con ese tema?',
    'Che pero qué tema de mierda jaja'
  ]
}

const listOfPrefixes = [
  'bf',
  'queonda',
  'hola', 'buenas',
  'puto', 'gato', 'gay', 'sorete', 'gil',
  'recomendame'
];

// Separa prefijos de mensajes y lo devuelve como objeto ó falso si no encuentra prefijo
const validatePrefix = messageTxt => {
  let messageArr = messageTxt.split(" ");
  let possiblePrefix = messageArr.shift().toLowerCase();

  for(let prefixItem of listOfPrefixes){
    if(possiblePrefix == prefixItem){
      let prefixObj = {
        prefix: possiblePrefix,
        message: messageArr.join(" ")
      }
      return prefixObj;
    }
  }

  return false;
}

// Identifica el tipo de prefijo y procesa el mensaje
const handleResponse = (obj, message) => {
  switch(obj.prefix){
    case 'bf':
      BFT.bfResponse(message, obj.message);
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
    case 'recomendame':
      let recom = tasteDive.TasteDive;
      new recom(message, obj.message);
      break;
  }
}


module.exports = {
  customResponses,
  listOfPrefixes,
  validatePrefix,
  handleResponse
}
