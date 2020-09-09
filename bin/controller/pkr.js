const HELPERS = require('../lib/helpers.js');

class PKR {
  constructor(message, cardsNum = 52){
    this.message = message;
    this.maze = [
      `2♠`, `2♣`, `2♥`, `2♦`,
      `3♠`, `3♣`, `3♥`, `3♦`,
      `4♠`, `4♣`, `4♥`, `4♦`,
      `5♠`, `5♣`, `5♥`, `5♦`,
      `6♠`, `6♣`, `6♥`, `6♦`,
      `7♠`, `7♣`, `7♥`, `7♦`,
      `8♠`, `8♣`, `8♥`, `8♦`,
      `9♠`, `9♣`, `9♥`, `9♦`,
      `10♠`, `10♣`, `10♥`, `10♦`,
      `J♠`, `J♣`, `J♥`, `J♦`,
      `Q♠`, `Q♣`, `Q♥`, `Q♦`,
      `K♠`, `K♣`, `K♥`, `K♦`,
      `A♠`, `A♣`, `A♥`, `A♦`
    ];
    this.discarded = [];
    this.flop = false;
    this.turn = false;
    this.river = false;
    this.players = {};

    this.discard(52 - cardsNum);
    this.shuffle();
  }

  shuffle() {
    for (let i = this.maze.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.maze[i], this.maze[j]] = [this.maze[j], this.maze[i]];
    }
  }

  discard(num = 0){
    this.discarded.push(this.maze.splice(0, num));
  }

  deal(num = 1, hidden = false, player = 'casa'){
    let hide = ''
    if(hidden) hide = '||';

    let hand = '';

    for(let i = num; i > 0; i--){
      if(!this.maze.length){
        return hand;
      }
      hand += hide + this.maze.pop() + hide + ' ';
    }

    if(!this.players.hasOwnProperty(player)){
      this.players[player] = {
        hand: '',
        bet: 0
      };
    }
    this.players[player].hand += hand;
    return hand;
  }

  play(){
    if(!this.flop){
      this.flop = this.deal(3);
      this.message.channel.send(`Va el Flop:\n${this.flop}`);
    } else {
      this.fourth();
    }
  }

  fourth(){
    if(!this.turn){
      this.turn = this.deal();
      this.message.channel.send(`Va el Turn:\n${this.flop}${this.turn}`);
    } else {
      this.fifth();
    }
  }

  fifth(){
    if(!this.river){
      this.river = this.deal();
      this.message.channel.send(`Va el River:\n${this.flop}${this.turn}${this.river}`);
    } else {
      this.message.channel.send('Ya repartí todas vieja.. quién ganó?');
    }
  }

  bet(num, player = 'casa'){
    if(!this.players.hasOwnProperty(player)){
      this.players[player] = {
        hand: '',
        bet: 0
      };
    }
    this.players[player].bet += parseInt(num);
    return true;
  }

  get bets(){
    let response = '';
    for(let player in this.players){
      response += `**${player}**: ${this.players[player].bet}\n`;
    }
    if(response != ''){
      response += '.. cómo la vé?';
      this.message.channel.send(response);
    } else {
      this.message.channel.send('Nadie apostó un carajo todavía.. todos pobres');
    }
  }

  get hands(){
    let response = '';
    for(let player in this.players){
      response += `**${player}**: ${this.players[player].hand}\n`;
    }
    if(response != ''){
      response += '.. ya no te acordabas, no?';
      this.message.channel.send(response);
    } else {
      this.message.channel.send('Se vé que están todos cagados porque nadie pidió cartas todavía');
    }
  }
}

var pkrGame;
const gameUndefined = () => {
  if(typeof(pkrGame) != 'undefined') return false;
  return true;
}

const pkrAction = (message, req) => {
  let reqArr = req.split(" ");

  let params = {
    req: reqArr[0].trim(),
    rest: []
  }
  for(let i = 1; i < reqArr.length; i++){
    params.rest.push(reqArr[i].trim());
  }

  switch(params.req){
    case 'nuevo':
      let cardsNum = 52;
      if(params.rest.length && !isNaN(params.rest[0])){
        cardsNum = params.rest[0];
      }
      pkrGame = new PKR(message, cardsNum);
      message.channel.send(HELPERS.getRandItem(['Listo', 'Dale que va', ' Estamo\'']));
      break;
    case 'dame':
    case 'deal':
      if(gameUndefined()){
        message.channel.send('Primero tenés que empezar un juego.. probá con \`nuevo\` ponele');
        return false;
      }
      if(!params.rest.length || isNaN(params.rest[0])){
        message.channel.send('Decime cuántas... un número');
        return false;
      }

      let hand = pkrGame.deal(parseInt(params.rest[0].trim()), true, message.author.username);
      if(hand == ''){
        message.channel.send('Me quedé sin cartas capo, hay que mezclar');
        return false;
      }
      message.channel.send(hand);
      break;
    case 'reparti':
    case 'flop':
    case 'turn':
    case 'river':
      if(gameUndefined()){
        message.channel.send('Antes empezá un juego con \`nuevo\`');
        return false;
      }
      pkrGame.play();
      break;
    case 'mazo':
      if(gameUndefined()){
        message.channel.send('Primero hay que empezar un juego.. poné \`nuevo\`');
        return false;
      }
      message.channel.send(`Quedan ${pkrGame.maze.length} cartas:
${pkrGame.maze.join(" ")}
*.. Obviamente ahora las tengo que mezclar de nuevo.... lpm*`);
      // Vuelve a mezclar después de mostrar
      pkrGame.shuffle();
      break;
    case 'mezcla':
    case 'mezclar':
    case 'shuffle':
      if(gameUndefined()){
        message.channel.send('Mandale \`nuevo\` primero');
        return false;
      }
      pkrGame.shuffle();
      message.channel.send('Ya mezclé otra vé.. contento?');
      break;
    case 'bet':
    case '+':
      if(gameUndefined()){
        message.channel.send('A dónde mierda querés apostar? Primero poné \`nuevo\` capo.. pero tan difícil es?');
        return false;
      }
      if(!params.rest.length || isNaN(params.rest[0])){
        message.channel.send('Cuánto ponés... dame un número');
        return false;
      }
      pkrGame.bet(params.rest[0], message.author.username);
      message.channel.send(HELPERS.getRandItem(['Lesto', 'Adeentro', 'Vamolopibe', 'La vas a perder, pero dale..']));
      break;
    case 'bets':
    case 'apuestas':
      if(gameUndefined()){
        message.channel.send('Qué apuestas si no hay juego? Poné \`nuevo\`');
        return false;
      }
      pkrGame.bets;
      break;
    case 'hands':
    case 'manos':
      if(gameUndefined()){
        message.channel.send('Qué manos si no hay juego? Poné \`nuevo\` gil de goma');
        return false;
      }
      pkrGame.hands;
      break;
    case 'win':
    case 'gane':
      if(gameUndefined()){
        message.channel.send('Qué manos si no hay juego? Poné \`nuevo\` gil de goma');
        return false;
      }
      message.channel.send(HELPERS.getRandItem([
        'Bieeen capo, te felicito!',
        'Bien aheeee!! Otra?',
        'Y sí.. altos muertos los otros',
        'Muy buena papá.. vamo con otra?',
        'Só re vó.. mandale otra',
        'Y qué queré que haga? Que te pague?'
      ]));
      break;
    default:
      message.channel.send('Si quisiste decir "algo de póker" se vé que lo hiciste mal porque no te entendí un porongo.. va de nuevo dale');
  }

}

module.exports = {
  pkrGame,
  pkrAction
}
