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


/*
{
    "Similar": {
        "Info": [{
            "Name": "Titanic",
            "Type": "movie",
            "wTeaser": " Titanic is a 1997 American epic romance and disaster film directed, written, co-produced, and co-edited by James Cameron. Incorporating both historical and fictionalized aspects, the film is based on accounts of the sinking of the RMS Titanic, and stars Leonardo DiCaprio and Kate Winslet as members of different social classes who fall in love aboard the ship during its ill-fated maiden voyage.Cameron's inspiration for the film came from his fascination with shipwrecks; he felt a love story interspersed with the human loss would be essential to convey the emotional impact of the disaster. Production began in 1995, when Cameron shot footage of the actual Titanic wreck. The modern scenes on the research vessel were shot on board the Akademik Mstislav Keldysh, which Cameron had used as a base when filming the wreck. Scale models, computer-generated imagery, and a reconstruction of the Titanic built at Baja Studios were used to re-create the sinking. The film was co-financed by Paramount Pictures and 20th Century Fox; the former handled distribution in North America while the latter released the film internationally. It was the most expensive film ever made at the time, with a production budget of $200\u00a0million.",
            "wUrl": "http://en.wikipedia.org/wiki/Titanic_(1997_film)",
            "yUrl": "https://www.youtube-nocookie.com/embed/ezcvpLIyifU",
            "yID": "ezcvpLIyifU"
        }],
        "Results": [{
            "Name": "Avatar",
            "Type": "movie",
            "wTeaser": "Avatar (marketed as James Cameron's Avatar) is a 2009 American epic science fiction film directed, written, produced, and co-edited by James Cameron and stars Sam Worthington, Zoe Saldana, Stephen Lang, Michelle Rodriguez, and Sigourney Weaver. The film is set in the mid-22nd century when humans are colonizing Pandora, a lush habitable moon of a gas giant in the Alpha Centauri star system, in order to mine the mineral unobtanium, a room-temperature superconductor. The expansion of the mining colony threatens the continued existence of a local tribe of Na'vi\u00a0\u2013 a humanoid species indigenous to Pandora. The film's title refers to a genetically engineered Na'vi body operated from the brain of a remotely located human that is used to interact with the natives of Pandora.",
            "wUrl": "http://en.wikipedia.org/wiki/Avatar_(2009_film)",
            "yUrl": "https://www.youtube-nocookie.com/embed/5PSNL1qE6VY",
            "yID": "5PSNL1qE6VY"
        }, {
            "Name": "The Notebook",
            "Type": "movie",
            "wTeaser": "The Notebook is a 2004 romantic drama film directed by Nick Cassavetes and written by Jeremy Leven from Jan Sardi's adaptation of the 1996 novel by Nicholas Sparks. The film stars Ryan Gosling and Rachel McAdams as a young couple who fall in love in the 1940s. Their story is read from a notebook in the present day by an elderly man (played by James Garner), telling the tale to a fellow nursing home resident (played by Gena Rowlands, who is Cassavetes's mother).The Notebook received generally mixed reviews, but performed well at the box office and received a number of award nominations, winning eight Teen Choice Awards, a Satellite Award, and an MTV Movie Award. The film became a sleeper hit and has gained a cult following. On November 11, 2012, ABC Family premiered an extended version with deleted scenes added back into the original storyline.",
            "wUrl": "http://en.wikipedia.org/wiki/The_Notebook_(2004_film)",
            "yUrl": "https://www.youtube-nocookie.com/embed/yDJIcYE32NU",
            "yID": "yDJIcYE32NU"
        }, {
            "Name": "Forrest Gump",
            "Type": "movie",
            "wTeaser": "Forrest Gump is a 1994 American comedy-drama film directed by Robert Zemeckis and written by Eric Roth. It is based on the 1986 novel of the same name by Winston Groom, and stars Tom Hanks, Robin Wright, Gary Sinise, Mykelti Williamson, and Sally Field. The story depicts several decades in the life of Forrest Gump (Hanks), a slow-witted but kind-hearted man from Alabama who witnesses and unwittingly influences several defining historical events in the 20th century United States. The film differs substantially from the novel.Principal photography took place in late 1993, mainly in Georgia, North Carolina, and South Carolina. Extensive visual effects were used to incorporate Hanks into archived footage and to develop other scenes. The soundtrack features songs reflecting the different periods seen in the film.",
            "wUrl": "http://en.wikipedia.org/wiki/Forrest_Gump",
            "yUrl": "https://www.youtube-nocookie.com/embed/XHhAG-YLdk8",
            "yID": "XHhAG-YLdk8"
        }, {
            "Name": "Cast Away",
            "Type": "movie",
            "wTeaser": "Cast Away is a 2000 American survival drama film directed and co-produced by Robert Zemeckis and starring Tom Hanks, Helen Hunt, and Nick Searcy. Hanks plays a FedEx employee stranded on an uninhabited island after his plane crashes in the South Pacific and his desperate attempts to survive. The film was released on December 22, 2000. It grossed $429 million worldwide, with Hanks nominated for Best Actor in a Leading Role at the 73rd Academy Awards.In 1995, Chuck Noland is a time-obsessed systems analyst, who travels the world resolving productivity problems at FedEx depots. He is in a long-term relationship with Kelly Frears, with whom he lives in Memphis, Tennessee. Although the couple wants to get married, Chuck's busy schedule interferes with their relationship.",
            "wUrl": "http://en.wikipedia.org/wiki/Cast_Away",
            "yUrl": "https://www.youtube-nocookie.com/embed/qGuOZPwLayY",
            "yID": "qGuOZPwLayY"
        }, {
            "Name": "Slumdog Millionaire",
            "Type": "movie",
            "wTeaser": "Slumdog Millionaire is a 2008 British crime drama film that is a loose adaptation of the novel Q & A (2005) by Indian author Vikas Swarup, telling the story of 18-year-old Jamal Malik from the Juhu slums of Mumbai. Starring Dev Patel as Jamal, and filmed in India, the film was directed by Danny Boyle, written by Simon Beaufoy, and produced by Christian Colson, with Loveleen Tandan credited as co-director. As a contestant on the Indian version of Who Wants to Be a Millionaire? Jamal surprises everyone by being able to answer every question correctly. Accused of cheating, Jamal recounts his life story to the police, illustrating how he is able to answer each question correctly.After its world premiere at the Telluride Film Festival and later screenings at the Toronto International Film Festival and the London Film Festival, Slumdog Millionaire had a nationwide release in the United Kingdom on 9 January 2009, in India on 23 January 2009, and in the United States on 25 December 2008. Regarded as a sleeper hit, Slumdog Millionaire was widely acclaimed, being praised for its plot, soundtrack, direction, and performances (especially Patel's). It was nominated for ten Academy Awards in 2009 and won eight\u2014the most for any 2008 film\u2014including Best Picture, Best Director, and Best Adapted Screenplay. It won seven BAFTA Awards including Best Film, five Critics' Choice Awards and four Golden Globes.",
            "wUrl": "http://en.wikipedia.org/wiki/Slumdog_Millionaire",
            "yUrl": "https://www.youtube-nocookie.com/embed/vI-lAIY2Iok",
            "yID": "vI-lAIY2Iok"
        }, {
            "Name": "The Curious Case Of Benjamin Button",
            "Type": "movie",
            "wTeaser": "The Curious Case of Benjamin Button is a 2008 American fantasy romantic drama film directed by David Fincher. The storyline by Eric Roth and Robin Swicord is loosely based on the 1922 short story of the same name by F. Scott Fitzgerald. The film stars Brad Pitt as a man who ages in reverse and Cate Blanchett as the love interest throughout his life. The film also stars Taraji P. Henson, Julia Ormond, Jason Flemyng, Elias Koteas, and Tilda Swinton.Producer Ray Stark bought the film rights to do the short story in the mid-1980s with Universal Pictures backing the film, but struggled to get the project off the ground until he sold the rights to producers Kathleen Kennedy and Frank Marshall in the 1990s. Although it was moved to Paramount Pictures in the 1990s, the film did not enter production until after Fincher and Pitt signed on along with the rest of the cast in 2005. Principal photography began in November 2006 and wrapped up in September 2007. Digital Domain worked on the visual effects of the film, particularly in the process of the metamorphosis of Pitt's character.",
            "wUrl": "http://en.wikipedia.org/wiki/The_Curious_Case_of_Benjamin_Button_(film)",
            "yUrl": "https://www.youtube-nocookie.com/embed/iH6FdW39Hag",
            "yID": "iH6FdW39Hag"
        }, {
            "Name": "The Shawshank Redemption",
            "Type": "movie",
            "wTeaser": "The Shawshank Redemption is a 1994 American drama film written and directed by Frank Darabont, based on the 1982 Stephen King novella Rita Hayworth and Shawshank Redemption. It tells the story of banker Andy Dufresne (Tim Robbins), who is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite his claims of innocence. Over the following two decades, he befriends a fellow prisoner, contraband smuggler Ellis \"Red\" Redding (Morgan Freeman), and becomes instrumental in a money-laundering operation led by the prison warden Samuel Norton (Bob Gunton). William Sadler, Clancy Brown, Gil Bellows, and James Whitmore appear in supporting roles.Darabont purchased the film rights to King's story in 1987, but development did not begin until five years later, when he wrote the script over an eight-week period. Two weeks after submitting his script to Castle Rock Entertainment, Darabont secured a $25 million budget to produce The Shawshank Redemption, which started pre-production in January 1993. While the film is set in Maine, principal photography took place from June to August 1993 almost entirely in Mansfield, Ohio, with the Ohio State Reformatory serving as the eponymous penitentiary. The project attracted many stars of the time for the role of Andy, including Tom Hanks, Tom Cruise, and Kevin Costner. Thomas Newman provided the film's score.",
            "wUrl": "http://en.wikipedia.org/wiki/The_Shawshank_Redemption",
            "yUrl": "https://www.youtube-nocookie.com/embed/NmzuHjWmXOc",
            "yID": "NmzuHjWmXOc"
        }, {
            "Name": "The Hangover",
            "Type": "movie",
            "wTeaser": "The Hangover is a 2009 American comedy film directed by Todd Phillips, co-produced with Daniel Goldberg, and written by Jon Lucas and Scott Moore. It is the first installment in The Hangover trilogy. The film stars Bradley Cooper, Ed Helms, Zach Galifianakis, Heather Graham, Justin Bartha, Ken Jeong, and Jeffrey Tambor. It tells the story of Phil Wenneck, Stu Price, Alan Garner, and Doug Billings, who travel to Las Vegas for a bachelor party to celebrate Doug's impending marriage. However, Phil, Stu, and Alan wake up with Doug missing and no memory of the previous night's events, and must find the groom before the wedding can take place.Lucas and Moore wrote the script after executive producer Chris Bender's friend disappeared and had a large bill after being sent to a strip club. After Lucas and Moore sold it to the studio for $2\u00a0million, Phillips and Jeremy Garelick rewrote the script to include a tiger as well as a subplot involving a baby and a police cruiser, and also including boxer Mike Tyson. Filming took place in Nevada for 15 days, and during filming, the three main actors (Cooper, Helms, and Galifianakis) formed a real friendship.",
            "wUrl": "http://en.wikipedia.org/wiki/The_Hangover_(film)",
            "yUrl": "https://www.youtube-nocookie.com/embed/tcdUhdOlz9M",
            "yID": "tcdUhdOlz9M"
        }, {
            "Name": "The Pursuit Of Happyness",
            "Type": "movie",
            "wTeaser": "The Pursuit of Happyness is a 2006 American biographical drama film directed by Gabriele Muccino and starring Will Smith as Chris Gardner, a homeless salesman. Smith's son Jaden Smith co-stars, making his film debut as Gardner's son, Christopher Jr. The screenplay by Steven Conrad is based on the best-selling memoir of the same name written by Gardner with Quincy Troupe. It is based on Gardner's nearly one-year struggle being homeless. The unusual spelling of the film's title comes from a mural that Gardner sees on the wall outside the daycare facility his son attends. The film was released on December 25, 2006 by Columbia Pictures. Smith received acclaim for his performance and was nominated for an Oscar and a Golden Globe for Best Actor.",
            "wUrl": "https://en.wikipedia.org/wiki/The_Pursuit_of_Happyness",
            "yUrl": "https://www.youtube-nocookie.com/embed/DMOBlEcRuw8",
            "yID": "DMOBlEcRuw8"
        }, {
            "Name": "The Hunger Games",
            "Type": "movie",
            "wTeaser": "The Hunger Games is a 2012 American dystopian science fiction adventure film directed by Gary Ross from a screenplay by Ross, Suzanne Collins, and Billy Ray. It is based on the 2008 novel of the same name by Collins. The film is the first installment in The Hunger Games film series. It stars Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth, Woody Harrelson, Elizabeth Banks, Lenny Kravitz, Stanley Tucci, and Donald Sutherland.The story takes place in a dystopian post-apocalyptic future in the nation of Panem, where a boy and a girl from each of the nation's 12 Districts are chosen annually as \"tributes\" and forced to compete in The Hunger Games, an elaborate televised fight to the death. Katniss Everdeen (Jennifer Lawrence) volunteers to take her younger sister's place, and with her district's male tribute, Peeta Mellark (Josh Hutcherson), travels to the Capitol to train and compete in the games.",
            "wUrl": "http://en.wikipedia.org/wiki/The_Hunger_Games_(film)",
            "yUrl": "https://www.youtube-nocookie.com/embed/mfmrPu43DF8",
            "yID": "mfmrPu43DF8"
        }]
    }
}
*/
