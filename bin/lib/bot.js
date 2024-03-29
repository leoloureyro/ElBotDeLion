const HELPERS = require('./helpers.js');
const BFT = require('../controller/bft.js');
const CASINO = require('../controller/casino.js');
const tasteDive = require('../controller/taste-dive.js');
const dotenv = require("dotenv");
dotenv.config();

// BOT Elements
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
  ],
  idiom: [
    'Ahí va algo en árabe -se lee de derecha a izquierda-: eel euq le otup',
    'Mirá, mirá, hablo alemán: te gusten el pedazen, troleken a cuerden',
    'Si no entendés chino googlea la traducción: 他妈的那个读的人',
    'Brazuca te gusta? banana nao tem carozo mais tem filamento grosso que dificulta a masticazao',
    'Nigga: yo madafaka nigga yo pussy pussy yo nigga',
    'Albañil del conurbano: Ajopyta nde petei apysarapo nde arruinado reikoa',
    'Porco Dio cane tu si che sei uno stronzo'
  ],
  help: [
    'Para no quedar como un boludo hablando solo tenés que tipear !comando, y reemplazar COMANDO por uno de los siguientes \n hola, buenas para que te salude \n queonda fulano para que te tire la posta sobre algún chabon o cosa \n puteame si te animas \n recomendame cosa1, cosa2 separado por comas para que te tire data de algo similar \n idioma si querés que te enseñe lo que aprendí viajando por el mundo \n profecia para que adivine tu futuro \n filosofia para recibir una frase inspiradora \n ayuda si tenés ganas de hinchar los huevos y leer todo otra vez'
  ],
  profecia: [
    'Hoy te van a romper los huevos del laburo',
    'El vecino de arriba, abajo o al lado se va a poner a hacer ruido cuando menos te lo esperes',
    'Se te va a enfriar el mate por pelotudear',
    'Un ser con cromosomas XX te romperá las bolas con la cosa más insólita y no habrá forma de evitarlo',
    'En la próxima cagada vas a tapar el inodoro',
    'Próximamente la pondrás',
    'Se te va a vencer un impuesto',
    'Vas a cabecear balas en el bayou como un campeón',
    'Revisá bien los bolsillos del pantalón/campera, te vas a encontrar unos mangos',
    '¿De verdad creés en estas boludeces?'
  ],
  filosofia: [
    'A buen entendedor, menos soplamocos',
    'Hay dos palabras que te abrirán muchas puertas: Tire y Empuje',
    'El cornudo y el pelotudo tienen algo en común: todos saben su condición menos él mismo',
    'Lo importante no es ganar, sino hacer perder al otro',
    'El que sabe, sabe. El que no, es jefe',
    'Nadie sabe lo que tiene hasta que se muda',
    'Es al pedo empujar cuando la mecha es corta, pues la cueva se desespera y los huevos se hacen torta',
    'Las mejores cosas de este mundo no se pueden comprar... porque tenemos sueldos de mierda'
  ],
  eightBall: [
    'En mi opinión, sí',
    'Es cierto',
    'Es decididamente así',
    'Probablemente',
    'Buen pronóstico',
    'Todo apunta a que sí',
    'Sin duda',
    'Sí',
    'Sí - definitivamente',
    'Debes confiar en ello',
    'Respuesta vaga, vuelve a intentarlo',
    'Pregunta en otro momento',
    'Será mejor que no te lo diga ahora',
    'No puedo predecirlo ahora',
    'Concéntrate y vuelve a preguntar',
    'Puede ser',
    'No cuentes con ello',
    'Mi respuesta es no',
    'Mis fuentes me dicen que no',
    'Las perspectivas no son buenas',
    'Muy dudoso'
  ]
}
const gamesCollection = [
  {
    name: 'Hunt: Showdown',
    channel: '688424573972381732',
    role: '823216195150151701',
    emoji: 'hunt'
  },
  {
    name: 'Hypercharge: Unboxed',
    channel: '741027177595797575',
    role: '823216600584552498',
    emoji: 'hypercharge'
  },
  {
    name: 'Counter-Strike: Global Offensive',
    channel: '823212932456120340',
    role: '823217277267869716',
    emoji: 'csgo'
  },
  {
    name: 'Battlefield 4',
    channel: '740600487648297000',
    role: '823217500572745749',
    emoji: 'bf4'
  },
  {
    name: 'Call of Duty: Warzone',
    channel: '823219941842223164',
    role: '823218792624554024',
    emoji: 'warzone'
  },
  {
    name: 'Left 4 Dead',
    channel: '691858466083438622',
    role: '823219395710943243',
    emoji: 'l4d'
  },
  {
    name: 'Apex Legends',
    channel: '781621083438710866',
    role: '823220037695438856',
    emoji: 'apex'
  },
  {
    name: 'Star Wars: Battlefront 2',
    channel: '823479764026654760',
    role: '823471032131518495',
    emoji: 'swb2'
  },
  {
    name: 'Phasmophobia',
    channel: '823521400802377729',
    role: '823470866892718091',
    emoji: 'phasmophobia'
  },
  {
    name: 'GTFO',
    channel: '850485300286324827',
    role: '850485335388979202',
    emoji: ''
  },
];

// Separa prefijos de mensajes y lo devuelve como objeto
const handlePrefix = messageTxt => {
  let messageArr = messageTxt.split(" ");
  let prefix = messageArr.shift().toLowerCase();
  let prefixObj = {
    prefix: prefix,
    message: messageArr.join(" ")
  }

  return prefixObj;
}

// Identifica el tipo de prefijo y procesa el mensaje
const handleResponse = (obj, message) => {
  switch(obj.prefix){
    case 'bf':
      BFT.bfResponse(message, obj.message, module.exports);
      break;
    case 'queonda':
      message.channel.send(HELPERS.getRandItem(customResponses.maySuggest));
      break;
    case 'host':
      message.channel.send(`Me está hosteando **${process.env.HOST}**`);
      break;
    case 'hola':
    case 'buenas':
      message.channel.send(HELPERS.getRandItem(customResponses.greeting));
      break;
    case 'puto':
    case 'gato':
    case 'gay':
    case 'sorete':
    case 'gil':
      message.channel.send(`Más ${obj.prefix} serás vos.. re${obj.prefix}`);
      break;
    case 'recommend':
    case 'recomendame':
      let recom = tasteDive.TasteDive;
      new recom(message, obj.message);
      break;
    case 'idioma':
      message.channel.send(HELPERS.getRandItem(customResponses.idiom));
      break;
    // case 'ayuda':
    //   message.channel.send(HELPERS.getRandItem(customResponses.help));
    //   break;
    case 'profecia':
      message.channel.send(HELPERS.getRandItem(customResponses.profecia));
      break;
    case 'filosofia':
      message.channel.send(HELPERS.getRandItem(customResponses.filosofia));
      break;
    case 'version':
    case 'v':
      message.channel.send(`Soy la versión **${process.env.npm_package_version}**`);
      break;
    case 'pkr':
      CASINO.casino(message, obj.message);
      break;
    case 'dice':
    case 'dado':
      message.channel.send(':game_die: ' + Math.ceil(Math.random() * 6));
      break;
    case '8ball':
    case 'bola8':
      message.channel.send(':8ball: ' + HELPERS.getRandItem(customResponses.eightBall));
      break;
    case 'moneda':
    case 'flip':
    case 'coin':
      message.channel.send(HELPERS.getRandItem(['Cara', 'Seca']));
      break;
    case 'slots':
    case 'maquinita':
      let slotsBet = 0;
      if(obj.message != '' && !isNaN(obj.message)) slotsBet = obj.message;
      CASINO.SCORE.changeScore(message.author.username, 0 - slotsBet);
      message.channel.send(CASINO.SLOTS.lever(slotsBet));
      CASINO.SCORE.changeScore(message.author.username, CASINO.SLOTS.score);
      CASINO.SLOTS.reset();
      break;
    case 'scores':
    case 'puntajes':
      message.channel.send(CASINO.SCORE.getScores());
      break;
    case 'score':
    case 'puntaje':
    case 'puntos':
      if(obj.message != '' && !isNaN(obj.message)){
        CASINO.SCORE.setScore(message.author.username, obj.message);
        message.channel.send(HELPERS.getRandItem([
          'Joya',
          'Entendido',
          'Roger',
          'Oka'
        ]));
      } else {
        message.channel.send(CASINO.SCORE.getScore(message.author.username));
      }
      break;
    case 'ayuda':
    case 'help':
      message.channel.send("Para ver la lista de comandos casicompleta *(y probablemente desactualizada)* leé mi docu en https://github.com/xtreme696/ElBotDeLion/blob/master/README.md . Acordate que mi prefijo es `!`, sino no te viá'ntender nada.");
      break;
    case 'room':
    case 'sala':
      let guild = message.guild;
      let parentCategory = guild.channels.resolve('824991150925414410');
      guild.channels.create(obj.message, {
        type: 'voice',
        parent: parentCategory
      })
        .then(newChannel => {
          message.client.on('voiceStateUpdate', async (oldState, newState) => {
            if(!newChannel.members.array().length) newChannel.delete('NIU').catch(console.error);
          })
        })
        .catch(console.error);

      message.channel.send("Nuevo canal creado! Si Repl.it no me reinicia el último en salir apaga la luz.");
      break;

    default:
      message.channel.send(HELPERS.getRandItem(customResponses.unknown));
  }
}

const createVoiceChannel = (name, limit = false) => {

}

module.exports = {
  customResponses,
  gamesCollection,
  handlePrefix,
  handleResponse
}
