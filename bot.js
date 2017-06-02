var request = require('request');
var Discordie = require('discordie');


var Utilities = require("./modules/utilities.js");

const Events = Discordie.Events;
const discordie = new Discordie();

var prefix = "]";


discordie.connect({
	token: 'PASTE_TOKEN_HERE'
});

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("connected as " + discordie.User.username);
	var game = {name: prefix+"help"};
	discordie.User.setGame(game);
});

//New member joined the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
	//e.message.channel.sendMessage('Welcome!');
});

//member left the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
	//e.message.channel.sendMessage('A User has left this channel.');
});

discordie.Dispatcher.on(Events.MESSAGE_DELETE, e => {
	//embed(e, e.message.content, "delete");
});

commands = ['ping', 'rng', 'flipcoin', 'help', 'getroles', 'avatar', 'quote', 'weather', 'clean', '8ball', 'serverinfo', 'userinfo', 'emote', 'lovecalc'];
desc = ['Check ping', 'Gives a random number between 1 to 100', 'Flips a coin', 'Shows this message', 'Get the roles of the mentioned user', 'Shows user\'s avatar', 'Get a quote', 'Get weather data for a location \nUsage : ``weather <Location>``', 'Cleans messages', 'Ask 8ball anything', 'Get Server Info', 'Get user info', 'Get Emote URL', 'Calculates love between people\nUsage: ``lovecalc <mention1> <mention2>``'];
//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e=>{
	//console.log(e.message.author.username);     
	var start = Date.now();
	if(!e.message.content.startsWith(prefix)) return;
	
	var cmd = e.message.content.split(' ')[0].split("");
	const params = e.message.content.split(' ').slice(1);
	cmd.shift();
	cmd = cmd.join("");
	try{
	switch(cmd){
		case commands[0] : e.message.channel.sendMessage('Pong! ``'+(Date.now()-start)+'ms``');
			break;

		case commands[1] : fembed(e, "Your random number is " + Math.round(Math.random()*100), " ");
			break;

		case commands[2] : fembed(e, "Its " + (Math.random() > 0.5 ? "Heads" : "Tails"), " ");
			break;

		case commands[3] : var str = "Commands available : \n";
			for(var i=0 ; i<commands.length ; i++){
				str += "**"+commands[i]+"**" + "\n" ;
				str += desc[i] + "\n" ;
			}
			str += "Use "+prefix+" as a prefix for the commands.";
			fembed(e, str, " ");
			break;
		
		case commands[4] : 
			if(e.message.mentions.length>0) var guildmember = discordie.Users.getMember(e.message.guild,e.message.mentions[0]);
			else var guildmember = e.message.member;
			var roleNames = guildmember.roles.map(role => role.name);
			var str = (roleNames.join("\n") || "No Roles");
			var embed = {
				"color":123134,
				"author":{
					"name": guildmember.name+"'s Roles",
				},
				"description":str
			};
			e.message.channel.sendMessage(" ", false, embed);

			break;
		
		case commands[5] : 
			if(e.message.mentions.length>0) var user = e.message.mentions[0];
			else var user = e.message.author;
			var embed = {
				"color":123134,
				"author":{
					"name": e.message.author.username+" #"+e.message.author.discriminator,
				},
				"image":{
					"url":user.avatarURL
				}
			};
			e.message.channel.sendMessage(" ",false,embed);
			break;
		
		case commands[6] : Utilities.quote(e);
			break;
		
		case commands[7] : Utilities.weather(e, params) ;
			break;
		
		case commands[8] : 
			e.message.channel.fetchMessages()
			.then(obj => {
				let msgarray = obj.messages;
				msgarray = msgarray.filter(m => m.author.id === discordie.User.id);   //ES2017 syntax
				msgarray.length = 100 + 1;
				msgarray.map(m => m.delete().catch(console.error));
			});

			break;

		case commands[9] : 
			if(params != "")
				fembed(e, Utilities.eightball()+", "+e.message.author.username, "");
			else
				e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``"+prefix+"8ball <question>``");
			break;

		case commands[10] :
			var guild = e.message.guild;
			e.message.channel.sendMessage(" ",false,Utilities.guildinfo(guild,discordie));
			break;

		case commands[11] :
			if(e.message.mentions.length>0) var user = e.message.mentions[0];
			else var user = e.message.author;
			
			e.message.channel.sendMessage(" ", false, Utilities.userinfo(e, user));
			break;

		case commands[12] :
			let regex = /(<:([^>]+):(\d+)>)/ig;
			match = regex.exec(e.message.content);
			var emojiurl = e.message.guild.getEmojiURL(match[3]);
			e.message.channel.sendMessage("Emoji Name: "+match[2]+"\n"+emojiurl);
			break;

		case commands[13] :
			if(e.message.mentions.length>=2){
			var fname = e.message.mentions[0].username;
			var sname = e.message.mentions[1].username;

			Utilities.lovecalc(e, fname,sname);
			}else
				e.message.channel.sendMessage("The Correct usage is\n``"+prefix+"lovecalc <mention1> <mention2>``");
			break;
	}
	
	}catch(err){e.message.channel.sendMessage("```"+err.message+"```");}
});



function fembed(e, content, event){
	const data = {
  		"description": content,
  		"color": 123134,
  		"author": {
    	"name": e.message.author.username,
    	"url": "https://discordapp.com",
    	"icon_url": e.message.author.avatarURL
        }
	};
	
	if(event == "delete")
		e.message.channel.sendMessage(e.message.author.username+" deleted their message", false, data);
	else
		e.message.channel.sendMessage(" ",false,data);
}



function weather(e, location){
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
	var key = '&APPID=25344f47dd3bf2225d2474ac80c139ca';
	var s = '';
	request(url+location+key , (err, res, body) => {
    	if (!err) {
    		var resp = JSON.parse(res);
    		console.log(body);
     		/*clocation = resp.name +", "+ resp.sys.country;
			cweather = resp.weather.description;
			ctemp = resp.main.temp -273.15;
			chumidity = resp.main.humidity;
			s = 'Weather is '+cweather+' at '+clocation+' with temperature at '
		 	+ctemp+' C '+' and '+chumidity+' humidity.';*/
		 	s = location;
  		} else{
   			console.log(err.message);
   			s = "Can't fetch weather data.";
		}
		e.message.channel.sendMessage(s);
	});
	return s;
}