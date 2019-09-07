/*
+============================+
	Chat Bot Twitch Apex Legends
		   By BlackSnow_
+============================+

 Ecrivez !apex PLATFORM PSEUDO

*/

var cloudscraper = require('cloudscraper');

cloudscraper.get('https://api.agora.gg/v1/players/3806268', function(error, response, body) {
  if (error) {
    //console.log('Error occurred');
  } else {
    //console.log(body, response);
  }
});

console.log("+============================+")
console.log("    Chat Bot Twitch Apex Legends")
console.log("        By BlackSnow_")
console.log("+============================+")

var prefix = "!apex";
var request = require("request")
var tmi = require("tmi.js");
var API_KEY = "oauth:s1arppkq396hriaf0byfmjtd35wb1k" // https://twitchapps.com/tmi/


var options = {
	options: {
		debug: true
	},
	connection: {
		reconnect: true
	},
	identity: {
		username: "EloStore",
		password: API_KEY // https://twitchapps.com - pour creer sa cle oauth twitch
	},
	channels: [process.env.BOT_CHANNEL]
}
var client = new tmi.client(options);
client.connect();

client.on("chat", (channel, user, message, self) =>{
	if(self) return

	if(channel = process.env.BOT_CHANNEL){ // #skydrowdll - nom du channel
		var n = message.includes(prefix);
		if(n){
			mystring = message.replace(prefix+" ",'');
			mystring = mystring.replace(prefix+" ",'%20');
			var url = 'https://api.agora.gg/v1/players/search?name='+mystring;
			request({
			    url: url,
			    json: true
			}, function (error, response, body) {
				var result = 'as';
			    if (!error && response.statusCode === 200) {
			       try{
			       		var string = JSON.stringify(body);
				        var objectValue = JSON.parse(string);
				        var responder = objectValue[0]['id'];
				        var url = "https://api.agora.gg/v1/players/"+responder
						request({
						    url: url,
						    json: true
						}, function (error, response, body) {
						    if (!error && response.statusCode === 200) {
						        var string = JSON.stringify(body);
						        var objectValue = JSON.parse(string);
						        var responder2 = objectValue['stats'][0]['elo'];
						        var elo = Math.round(responder2 * 100) / 100;
						        var rank = "nop";

						        if(elo>=0){rank = "Bronze"}
						        if(elo>=1100){rank = "Silver"}
						        if(elo>=1300){rank = "Gold"}
						        if(elo>=1500){rank = "Platine"}
						        if(elo>=1700){rank = "Diams"}
						        if(elo>=2200){rank = "Master"}

						       	var player_name = objectValue['name'];
						    	var player_party_play = objectValue['stats'][0]['gamesPlayed'];
						    	var player_party_wins = objectValue['stats'][0]['wins'];
						    	var player_kill = objectValue['stats'][0]['kills'];
						    	var player_death = objectValue['stats'][0]['deaths'];
						    	var player_assist = objectValue['stats'][0]['assists'];
						    	var player_ranky = objectValue['stats'][0]['rank'];
							var player_name2 = player_name.replace(" ",'%20');
						        if(process.env.BOT_LANGUE == "english"){
						    		if(elo>=0){rank = "Bronze"}
							        if(elo>=1100){rank = "Silver"}
							        if(elo>=1300){rank = "Gold"}
							        if(elo>=1500){rank = "Platine"}
							        if(elo>=1700){rank = "Diamond"}
							        if(elo>=2200){rank = "Master"}
						    		var mareponce = ""+player_name+" be "+rank+" with "+elo+" elo, he played "+player_party_play+" party and wins "+player_party_wins+" of them, "+player_name+" massacred "+player_kill+" players with only "+player_death+" died, he shared "+player_assist+" enemy, which makes of him top "+player_ranky+" players. ";
						    	}

						    	if(process.env.BOT_LANGUE == "french"){
						    		if(elo>=0){rank = "Bronze"}
							        if(elo>=1100){rank = "Silver"}
							        if(elo>=1300){rank = "Gold"}
							        if(elo>=1500){rank = "Platine"}
							        if(elo>=1700){rank = "Diams"}
							        if(elo>=2200){rank = "Master"}
						    		var mareponce = ""+player_name+" est "+rank+" avec "+elo+" elo, il a joué à "+player_party_play+" parti et en a gagné "+player_party_wins+", "+player_name+" a massacré "+player_kill+" joueurs au dépourvu de "+player_death+" morts, il a tout de même partagé "+player_assist+" ennemies, ce qui fait de lui top "+player_ranky+" joueurs.";
						    	}
						        client.say(process.env.BOT_CHANNEL, ""+mareponce)


							console.log("========")
						        console.log(elo)
						        console.log("========")
						    }else{
						    	client.say(process.env.BOT_CHANNEL, "Error")
						    }
						})

			       }catch(err){
			 			client.say(process.env.BOT_CHANNEL, "Le compte est privé ou le joueur en question n'existe pas!")
			       }
			    }
			})
		}
	}
})
