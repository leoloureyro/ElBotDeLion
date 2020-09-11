const HELPERS = require('../lib/helpers.js');

class Score {
  constructor(){
    this.players = {};
  }

  setScore(player, val = 0){
    if(val != 0 && (val.startsWith('+') || val.startsWith('-'))){
      return this.changeScore(player, val)
    }
    this.players[player] = parseInt(val);
    return val;
  }

  changeScore(player, val = 0){
    if(!this.players.hasOwnProperty(player)){
      this.setScore(player);
    }
    this.players[player] += parseInt(val);
    return val;
  }

  getScore(player){
    if(!this.players.hasOwnProperty(player)){
      this.setScore(player);
    }
    return `**${player}**: ${this.players[player]}`;
  }

  getScores(){
    let scoresMsg = '';
    for(let player in this.players){
      scoresMsg += `**${player}**: ${this.players[player]}\n`
    }
    scoresMsg += '..';
    return scoresMsg;
  }
}

class Pkr {
  constructor(message, cardsNum = 52){
    this.message = message;
    this.deck = [
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
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  discard(num = 0, cards = this.deck){
    this.discarded.push(cards.splice(0, num));
  }

  deal(num = 1, hidden = false, player = 'casa'){
    let hide = ''
    if(hidden) hide = '||';

    let hand = '';

    for(let i = num; i > 0; i--){
      if(!this.deck.length){
        return hand;
      }
      hand += hide + this.deck.pop() + hide + ' ';
    }

    this.checkForPlayer(player);
    this.players[player].hand += hand;
    return hand;
  }

  checkForPlayer(player){
    if(!this.players.hasOwnProperty(player)){
      this.players[player] = {
        hand: '',
        bet: 0
      };
    }
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

  resetBets(){
    for(let player in this.players){
      this.players[player].bet = 0;
    }
    return true;
  }

  fold(player){
    this.checkForPlayer(player);
    this.players[player].hand = '';
    return true;
  }

  showOff(player){
    this.checkForPlayer(player);
    return `**${player}**: ${this.players[player].hand.replace(/\|\|/g, "")}`;
  }

  getBet(player){
    this.checkForPlayer(player);
    return `Hasta ahora pusiste ${this.players[player].bet}`;
  }

  get bets(){
    let response = 'La cosa viene así:\n';
    for(let player in this.players){
      response += `**${player}**: ${this.players[player].bet}\n`;
    }
    if(response != ''){
      response += '.. cómo la vé?';
      return response;
    } else {
      return 'Nadie apostó un carajo todavía.. todos pobres';
    }
  }

  getHand(player){
    this.checkForPlayer(player);
    return `**${player}**: ${this.players[player].hand}`;
  }

  get hands(){
    let response = '';
    for(let player in this.players){
      response += `**${player}**: ${this.players[player].hand}\n`;
    }
    if(response != ''){
      response += '.. no seas cagón eh, no vale mirar las del otro';
      return response;
    } else {
      return 'Se vé que están todos cagados porque nadie pidió cartas todavía';
    }
  }

  get total(){
    let total = 0;
    for(let player in this.players){
      total += this.players[player].bet;
    }
    return total;
  }
}

class Slots {
  constructor(){
    this.figures = [
      ':bell:',
      ':bomb:',
      ':apple:',
      ':banana:',
      ':skull:',
      ':space_invader:'
    ];
    this.turn = [];
    this.score = 0;
    this._cols = 3;
    this._multipliers = {
      ':bell:': 0,
      ':bomb:': 0,
      ':apple:': 0,
      ':banana:': 1.2,
      ':skull:': 0.8,
      ':space_invader:': 1.5
    }
  }

  lever(bet = 0){
    // TODO función... el player y score lo maneja el switch case
    this.score += bet;
    for(let i = 0; i < this._cols; i++){
      this.turn.push(this.figure);
    }
    this.updateScore();

    return this.string;
  }

  updateScore(){
    if(!this.turn.length) return false; // En caso de que algo falle y no haya cargado el turno
    if(this.turn[0] == this.turn[1]){
      this.score *= 10;
      if(this.turn[1] == this.turn[2]){
        this.score *= 50;
      }
      // Multipliers
      if(this._multipliers[this.turn[0]] > 0){
        this.score *= this._multipliers[this.turn[0]];
      }
    } else {
      this.score *= this._multipliers[this.turn[0]];
    }
    this.score = Math.floor(this.score);
  }

  reset(){
    this.turn = [];
    this.score = 0;
  }

  get figure(){
    return HELPERS.getRandItem(this.figures);
  }

  get string(){
    return this.turn.join(" | ");
  }
}

var SCORE = new Score();
var SLOTS = new Slots();
var PKR;

const gameUndefined = () => {
  if(typeof(PKR) != 'undefined') return false;
  return true;
}

const casino = (message, req) => {
  let reqArr = req.split(" ");

  let params = {
    req: reqArr[0].trim(),
    rest: []
  }
  for(let i = 1; i < reqArr.length; i++){
    params.rest.push(reqArr[i].trim());
  }

  switch(params.req){
    // Pkr
    case 'nuevo':
    case 'new':
      let cardsNum = 52;
      if(params.rest.length && !isNaN(params.rest[0])){
        cardsNum = params.rest[0];
      }
      PKR = new Pkr(message, cardsNum);
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

      let hand = PKR.deal(parseInt(params.rest[0].trim()), true, message.author.username);
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
      PKR.play();
      break;
    case 'mazo':
    case 'deck':
      if(gameUndefined()){
        message.channel.send('Primero hay que empezar un juego.. poné \`nuevo\`');
        return false;
      }
      message.channel.send(`Quedan ${PKR.deck.length} cartas:
${PKR.deck.join(" ")}
*.. Obviamente ahora las tengo que mezclar de nuevo.... lpm*`);
      // Vuelve a mezclar después de mostrar
      PKR.shuffle();
      break;
    case 'mezcla':
    case 'mezclar':
    case 'shuffle':
      if(gameUndefined()){
        message.channel.send('Mandale \`nuevo\` primero');
        return false;
      }
      PKR.shuffle();
      message.channel.send('Ya mezclé otra vé.. contento?');
      break;
    case '+':
    case 'bet':
    case 'apuesta':
      if(gameUndefined()){
        message.channel.send('A dónde mierda querés apostar? Primero poné \`nuevo\` capo.. pero tan difícil es?');
        break;
      }
      if(!params.rest.length || isNaN(params.rest[0])){
        message.channel.send(PKR.getBet(message.author.username));
        break;
      }
      PKR.bet(params.rest[0], message.author.username);
      message.channel.send(HELPERS.getRandItem(['Lesto', 'Adeentro', 'Vamolopibe', 'La vas a perder, pero dale..']));
      // Cambia el score global
      SCORE.changeScore(message.author.username, 0 - params.rest[0]);
      break;
    case 'bets':
    case 'apuestas':
      if(gameUndefined()){
        message.channel.send('Qué apuestas si no hay juego? Poné \`nuevo\`');
        return false;
      }
      message.channel.send(PKR.bets);
      break;
    case 'hand':
    case 'mano':
      message.channel.send(`${PKR.getHand(message.author.username)}.. ya no te acordabas, no?`)
      break;
    case 'hands':
    case 'manos':
      if(gameUndefined()){
        message.channel.send('Qué manos si no hay juego? Poné \`nuevo\` gil de goma');
        return false;
      }
      message.channel.send(PKR.hands);
      break;
    case 'win':
    case 'gane':
      if(gameUndefined()){
        message.channel.send('Qué manos si no hay juego? Poné \`nuevo\` gil de goma');
        return false;
      }
      let winMsg = HELPERS.getRandItem([
        'Bieeen capo, te felicito!',
        'Bien aheeee!! Otra?',
        'Y sí.. altos muertos los otros',
        'Muy buena papá.. vamo con otra?',
        'Só re vó.. mandale otra',
        'Y qué queré que haga? Que te pague?'
      ]);
      winMsg += `\nTe llevás +${PKR.total}`;
      message.channel.send(winMsg);
      // Cambia el score global
      SCORE.changeScore(message.author.username, PKR.total);
      break;
    case 'fold':
    case 'chau':
    case 'mevoy':
    case 'lovemo':
      PKR.fold(message.author.username);
      message.channel.send(HELPERS.getRandItem([
        'Uhfff.. y.. con esa mano de mierda te entiendo',
        'Te corren con cualquier cosa eh...',
        'CAGÓN',
        'Jajajaja dió mío',
        'Buo, dale'
      ]));
      break;
    case 'show':
    case 'mostrar':
      message.channel.send(PKR.showOff(message.author.username));
      PKR.fold(message.author.username);
      break;

    // SCORES
    case 'scores':
    case 'puntajes':
      message.channel.send(SCORE.getScores());
      break;
    case 'score':
    case 'puntaje':
    case 'puntos':
      if(params.rest.length && !isNaN(params.rest[0])){
        SCORE.setScore(message.author.username, params.rest[0]);
        message.channel.send(HELPERS.getRandItem([
          'Joya',
          'Entendido',
          'Roger',
          'Oka'
        ]));
        break;
      }
      message.channel.send(SCORE.getScore(message.author.username));
      break;
    case 'reset':
      SCORE = new Score();
      PKR = new Pkr(message);
      message.channel.send(HELPERS.getRandItem([
        'Todo como nuevo :+1:',
        'Ya te reinicié la movida.. ahora?',
        '0km'
      ]));
      break;

    default:
      message.channel.send('Si quisiste decir "algo de póker" se vé que lo hiciste mal porque no te entendí un porongo.. va de nuevo dale');
  }
}

module.exports = {
  SCORE,
  PKR,
  SLOTS,
  casino
}
