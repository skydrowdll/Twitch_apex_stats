/*
+============================+
	Chat Bot Twitch Apex Legends
		   By Bl4ckSnow_
+============================+

npm i cloudscrapper
npm i request
npm i tmi.js

!apex PLATFORM PLAYERNAME

*/

console.log("+===================================+")
console.log("    Chat Bot Twitch Apex Legends")
console.log("           By Bl4ckSnow_")
console.log("+===================================+")

const cloudscraper = require('cloudscraper');
const request = require("request")
const TwitchBot = require('twitch-bot')
const fs = require('fs');
const ConfigFile ="./config.json";
const opn = require('opn');
const prefix = "!apex";
fs.access(ConfigFile, fs.F_OK, (err) => {
  if (err) {
    CreateConfigFile();
    return
  }
  Main();
})
function Main(){
  var TRACKER_KEY = TrackerKey();
  var CHANNEL_KEY = ChanKey();
  var TWITCH_KEY  = TwitchKey();
  const Bot = new TwitchBot({
    username: 'ApexBot',
    oauth: TWITCH_KEY,
    channels: [CHANNEL_KEY]
  })
  Bot.on('error', err => {
    console.log(err)
  })
  Bot.on('connected', channel => {
    Bot.say("Hello, i'm connected and i can show your apex legends stats, juste write !apex pc/xbx/ps4 PlayerName ")
  })
  Bot.on('message', chatter => {
    var n = chatter.message.includes(prefix);
		if(n){
      if(chatter.message === '!apex') {
        Bot.say('Write !apex pc/xbx/ps4 PlayerName')
      }else{
        var spitter = chatter.message.split(' ')
        var viewer = "null";
        var url = PreformatedURL(spitter[1],spitter[2],TRACKER_KEY);
        request({
          url: url,
          json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
              try{
                var Alljson = JSON.stringify(body);
                var allobjectValue = JSON.parse(Alljson);
                var AccountStats = allobjectValue.data.stats
                var stats_object = JSON.stringify(AccountStats);
                var objectValue = JSON.parse(stats_object);
                var total_result="";
                for (var i = 0; i < objectValue.length; i++) {
                  try{
                    var stat_key = objectValue[i].metadata.name.toUpperCase()
                    var stat_value = objectValue[i].value
                    if(stat_value!==null){

                      if(i===objectValue.length-1){
                        total_result += stat_value+" "+stat_key
                      }else{
                        total_result += stat_value+" "+stat_key+" | "
                      }
                    }
                  }catch{}
                }
              Bot.say("@"+chatter.username+" "+total_result)
              var LegendsStats = allobjectValue.data.children
              var Legends_object = JSON.stringify(LegendsStats);
              var objectValue = JSON.parse(Legends_object);
              var full = "";
              for (var i = 0; i < objectValue.length; i++) {
                try{
                  var Legend = objectValue[i].metadata.legendName.toUpperCase()
                  var StatsLeng = objectValue[i].stats
                  var Legends_stats_object = JSON.stringify(StatsLeng);
                  var objectlsValue = JSON.parse(Legends_stats_object);
                  var total_result="";
                  for (var a = 0; a < objectlsValue.length; a++) {
                    try {
                      var name = objectlsValue[a].metadata.name.toUpperCase();
                      var value = objectlsValue[a].value;
                      if(a===objectValue.length-1){
                        total_result += value+" "+name
                      }else{
                        total_result += value+" "+name+", "
                      }
                    } catch{}
                  }
                  if(i===objectValue.length-1){
                    full += Legend+" - "+total_result
                  }else{
                    full += Legend+" - "+total_result+" || "
                  }
                }catch{}
              }
              Bot.say("@"+chatter.username+ " " +full)
              }catch(err){
                console.log("oups")
                Bot.say("@"+chatter.username+ " mmmh sorry i don't found your account in the system :C")
              }
            }else{
              console.log("oups")
              Bot.say("@"+chatter.username+ " mmmh sorry i don't found your account in the system :C")
            }
        })
      }
    }
  })
}
function CreateConfigFile(){
  console.log("==========================");
  console.log(" Configuration Builder")
  console.log("==========================");
  opn('https://twitchapps.com/tmi/');
  opn('https://tracker.gg/developers/apps');
  var key,tracker,chanel;
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })
  readline.question(`Twitch Chat OAuth Password Generator: `, (obj) => {
    key = obj;
    readline.question(`Tracker api: `, (obj) => {
      tracker = obj;
      readline.question(`Chanel Bot (ex: #yourname): `, (obj) => {
        chanel = obj;
        var config = {
            key: key,
            chanel: chanel,
            traker: tracker,
        }
        config = { config }
        CreateFile(config);
        readline.close()
      })
    })

  })
}
function CreateFile(Config){
  const jsonString = JSON.stringify(Config)
  fs.writeFile(ConfigFile, jsonString, err => {
      if (err) {
          console.log('Error writing file', err)
      } else {
          console.log('Configuration Builder Success')
          console.log('You can edit Manualy'+ConfigFile+" if a twitch, tracker key have change ;) ")
          Main()
      }
  })
}
function PreformatedURL(PLATFORM,PLAYERNAME,TRACKER_KEY){
  var platform = GetPlatform(PLATFORM);
  var url = "https://public-api.tracker.gg/v1/apex/standard/profile/"+platform+"/"+PLAYERNAME+"?TRN-Api-Key="+TRACKER_KEY;
  return url;
}
function GetPlatform(PLATFORM){
  switch (PLATFORM) {
    case "pc":
      return "origin";
      break;
    case "xbx":
      return "xbl";
      break;
    case "ps4":
      return "psn";
      break;
    default:
      return "origin";
  }
}
function ChanKey(){
  var json = JSON.parse(fs.readFileSync(ConfigFile, 'utf8'));
  return json.config.chanel;
}
function TrackerKey(){
  var json = JSON.parse(fs.readFileSync(ConfigFile, 'utf8'));
  return json.config.traker;
}
function TwitchKey(){
  var json = JSON.parse(fs.readFileSync(ConfigFile, 'utf8'));
  return json.config.key;
}
