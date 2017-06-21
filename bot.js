var request = require('request');
var Discordie = require('discordie');


var Utilities = require("./modules/utilities.js");
var Moderation = require("./modules/moderation.js");

const Events = Discordie.Events;
const discordie = new Discordie();

var prefix = "]";

var Key = require('./key.js');
discordie.connect({
	token: Key.getBotToken() //Paste your Bot Application Token here instead of Key.getBotToken()
});

var settings = {
	"23213231231231321":{
		deletech:null,
		starboardch:null,
		welcomech:null
	},
	"23131321312313214":{
		deletech:null,
		starboardch:null,
		welcomech:null
	}
};

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("connected as " + discordie.User.username);
	var game = {name: prefix+"help"};
	discordie.User.setGame(game);
});

//New member joined the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
	//e.message.channel.sendMessage('Welcome!');
	if(settings.hasOwnProperty(e.guild.id))
		if(settings[e.guild.id].welcomech)
			settings[e.guild.id].welcomech.sendMessage("Welcome! "+e.member.mention+" to "+e.guild.name);

});

//member left the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
	//e.message.channel.sendMessage('A User has left this channel.');
});

discordie.Dispatcher.on(Events.MESSAGE_DELETE, e => {
	//embed(e, e.message.content, "delete");
	if(settings.hasOwnProperty(e.message.guild.id))
		if(settings[e.message.guild.id].deletech)
			settings[e.message.guild.id].deletech.sendMessage(e.message.timestamp, false, fembed(e, "delete"));
});

discordie.Dispatcher.on(Events.MESSAGE_REACTION_ADD, e => {
	if(settings.hasOwnProperty(e.message.guild.id))
		if(settings[e.message.guild.id].starboardch)
			settings[e.message.guild.id].starboardch.sendMessage("Emoji: "+e.emoji.name+"\nMessage: "+e.message.content+"\nUser: "+e.user.uername);
});

commands = ['ping', 'rng', 'flipcoin', 'help', 'getroles', 'avatar', 'quote', 'weather', 'clean', '8ball', 'serverinfo', 'userinfo', 'emote', 'lovecalc', 'kick', 'ban', 'say', 'set', 'urban'];
desc = ['Check ping', 'Gives a random number between 1 to 100', 'Flips a coin', 'Shows this message', 'Get the roles of the mentioned user', 'Shows user\'s avatar', 'Get a quote', 'Get weather data for a location \nUsage : ``weather <Location>``', 'Cleans messages', 'Ask 8ball anything', 'Get Server Info', 'Get user info', 'Get Emote URL', 'Calculates love between people\nUsage: ``lovecalc <mention1> <mention2>``', 'Kicks a user', 'Bans a user', 'Make the bot say something', 'Set various channels for specific features of the bot.', 'Get definition of the word from urban dictionary'];
//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e=>{
	//console.log(e.message.author.username);     
	var start = Date.now();
	if(!e.message.content.startsWith(prefix)) return;
	
	var cmd = e.message.content.split(' ')[0].split("");
	const params = e.message.content.split(' ').slice(1);
	cmd.shift();
	cmd = cmd.join("");

	console.log(params);
	try{
	switch(cmd){
		case commands[0] : e.message.channel.sendMessage('Pong!').then(m=>m.edit('Pong! ``'+(Date.now()-start)+'ms``'));
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
					"url":user.avatarURL+"?size=1024"
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

		case commands[14]:
			Moderation.kick(e, Discordie);
			break;

		case commands[15]:
			Moderation.ban(e, Discordie);
			break;

		case commands[16]:
			e.message.channel.sendMessage(params.join(" "));
			break;

		case commands[17]://set
			if(!settings.hasOwnProperty(e.message.guild.id)) settings[e.message.guild.id] = { welcomech:null, starboardch:null, deletech:null };
			if(e.message.author.can(Discordie.Permissions.General.MANAGE_CHANNELS, e.message.guild))
				switch(params[0]){
					case "deletelog": settings[e.message.guild.id].deletech = e.message.channel;
						e.message.channel.sendMessage("Deleted messages logging channel successfully set.");
						break;

					case "starboard": settings[e.message.guild.id].starboardch = e.message.channel;
						e.message.channel.sendMessage("Starboard channel successfully set.");
						break;

					case "welcome": settings[e.message.guild.id].welcomech = e.message.channel;
						e.message.channel.sendMessage("Welcome channel successfully set.");
						break;

					case "reset" :  settings[e.message.guild.id].deletech = null;
									settings[e.message.guild.id].welcomech = null;
									settings[e.message.guild.id].starboardch = null;
						e.message.channel.sendMessage("Settings reset.");
						break;

					default: e.message.channel.sendMessage("``set welcome`` Sets the channel for welcome greetings when new members are added.\n``set deletelog`` Sets channel for deleted messages logging.\n``set starboard`` Sets the channel for starboard feature of the bot. Add a star reaction to a message to make the bot post it in starboard channel.\n``set reset`` Resets the guild settings.");
						break;

				}

			break;

		case commands[18]:
			Utilities.urban(e, params);
			break;
	}
	
	}catch(err){e.message.channel.sendMessage("```"+err.message+"```");}
});


function fembed(e, event){
	const data = {
  		"description": e.message.content,
  		"color": 123134,
  		"author": {
    	"name": e.message.author.username,
    	"url": e.message.author.avatarURL,
    	"icon_url": e.message.author.avatarURL
        }
	};
	
	if(event == "delete")
		return data;
	else
		e.message.channel.sendMessage(" ",false,data);
}