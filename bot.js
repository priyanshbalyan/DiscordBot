const request = require('request');
const Discordie = require('discordie');
const fs = require('fs');

const Utilities = require("./modules/utilities.js");
const Moderation = require("./modules/moderation.js");
const Setter = require("./modules/setter.js");
const Tags = require("./modules/tags.js");

const Events = Discordie.Events;
const discordie = new Discordie();

var prefix = "]";

var Key = require('./Key.js');
discordie.connect({
	token: Key.getBotToken() //Paste your Bot Application Token here instead of Key.getBotToken()
});

let settings = JSON.parse(fs.readFileSync("./settings.json","utf8"));

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("connected as " + discordie.User.username);
	var game = {name: prefix+"help"};
	discordie.User.setGame(game);
});

//New member joined the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
	//e.message.channel.sendMessage('Welcome!');
	Setter.welcome(e, discordie, settings);
});

//member left the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
	//e.message.channel.sendMessage('A User has left this channel.');
});

discordie.Dispatcher.on(Events.MESSAGE_DELETE, e => {
	//embed(e, e.message.content, "delete");
	Setter.deletelog(e, discordie, settings)
});

discordie.Dispatcher.on(Events.MESSAGE_REACTION_ADD, e => {	
	Setter.starboard(e, discordie, settings);
});

//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e=>{
	//console.log(e.message.author.username);     
	var start = Date.now();
	if(!e.message.content.startsWith(prefix)) return;
	
	var cmd = e.message.content.split(' ')[0].split("");
	const params = e.message.content.split(/\n|\s/).slice(1); //split at space and new line
	cmd.shift();
	cmd = cmd.join("");

	console.log(params);
	try{
	switch(cmd){
		case 'ping' : e.message.channel.sendMessage('Pong!').then(m=>m.edit('Pong! ``'+(Date.now()-start)+'ms``'));
			break;

		case 'rng' : Utilities.fembed(e, "Your random number is " + Math.round(Math.random()*100));
			break;

		case 'flipcoin' : Utilities.fembed(e, "Its " + (Math.random() > 0.5 ? "Heads" : "Tails"));
			break;

		case 'help' : 
			Utilities.helpmsg(e, prefix, discordie.User.avatarURL);
			break;
		
		case 'getroles' : 
			var guildmember = (e.message.mentions[0]) ? discordie.Users.getMember(e.message.guild,e.message.mentions[0]) : e.message.member;
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
		
		case 'avatar' : 
			var user = (e.message.mentions[0]) ? e.message.mentions[0] : e.message.author;
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
		
		case 'quote' : Utilities.quote(e);
			break;
		
		case 'weather' : 
			if(params != "") Utilities.weather(e, params) ;
			else e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``"+prefix+"weather <location>``"); 
			break;
		
		case 'clean' : 
			e.message.channel.fetchMessages().then(obj => {
				let msgarray = obj.messages;
				msgarray = msgarray.filter(m => m.author.id === discordie.User.id);
				msgarray.length = 100 + 1;
				msgarray.map(m => m.delete().catch(console.error));
			});

			break;

		case '8ball' : 
			if(params != "")
				Utilities.fembed(e, Utilities.eightball()+", "+e.message.author.username);
			else
				e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``"+prefix+"8ball <question>``");
			break;

		case 'serverinfo' :
			var guild = e.message.guild;
			e.message.channel.sendMessage(" ",false,Utilities.guildinfo(guild,discordie));
			break;

		case 'userinfo' :
			var user = (e.message.mentions[0]) ? e.message.mentions[0] : e.message.author;
						
			e.message.channel.sendMessage(" ", false, Utilities.userinfo(e, user));
			break;

		case 'emote' :
			if(params != ""){
				let regex = /(<:([^>]+):(\d+)>)/ig;
				match = regex.exec(e.message.content);
				var emojiurl = e.message.guild.getEmojiURL(match[3]);
				e.message.channel.sendMessage("Emoji Name: "+match[2]+"\n"+emojiurl);
			}
			else
				e.message.channel.sendMessage("The correct usage is ``"+prefix+"emote :emoji:``");
			break;

		case 'lovecalc' :
			if(e.message.mentions.length>=2){
				var fname = e.message.mentions[0].username;
				var sname = e.message.mentions[1].username;
				Utilities.lovecalc(e, fname,sname);
			}else
				e.message.channel.sendMessage("The Correct usage is ``"+prefix+"lovecalc <mention1> <mention2>``");
			break;

		case 'kick' :
			Moderation.kick(e, discordie);
			break;

		case 'ban' :
			Moderation.ban(e, discordie);
			break;

		case 'say' :
			e.message.channel.sendMessage(params.join(" "));
			console.log(e.message.attachments);
			break;

		case 'set' ://set
			Setter.set(e, Discordie, settings, params, discordie);
			break;

		case 'urban' :
			Utilities.urban(e, params);
			break;

		case 'mute' :
			Moderation.mute(e, params, discordie);
			break;

		case 'unmute' :
			Moderation.unmute(e, params);
			break;

		case 'invite' :
			e.message.channel.sendMessage("Invite me using this link - \nhttps://discordapp.com/oauth2/authorize?client_id=289776005504040960&scope=bot");
			break;

		case 'addrole':
			Setter.addrole(e, params, settings);
			break;

		case 'removerole':
			Setter.removerole(e, params, settings);
			break;

		case 'selfrolelist': e.message.channel.sendMessage("Self-assignable roles : "+(settings[e.message.guild.id].selfroles.join(", ")||"No Self-assignable roles set."));
			break;
			
		case 'getperms' :
			Utilities.getperms(e);
			break;

		case 'google': case 'g':
			Utilities.googlesearch(e, params);
			break;

		case 'star' :
			discordie.Messages.get(params[0]).addReaction(e.message.reactions[0].emoji);
			break;

		case 'tag' :
			Tags.tag(e, params);
			break;

		case 'setgame':
			if(e.message.author.id !== "279207740340043776") return;
			var game = {"name": params.join(" ")};
			discordie.User.setGame(game);
			break;

		case 'eval' :
			if(e.message.author.id !== "279207740340043776") return;
			try{
				const code = e.message.content.split(" ").slice(1).join(" ");
				let evaled = eval(code);

				if(typeof(evaled) !== "string")
					evaled = require("util").inspect(evaled);

				e.message.channel.sendMessage(Utilities.cleancode(evaled), {code: "xl"});
			}catch(err){
				e.message.channel.sendMessage("```xl\n"+Utilities.cleancode(err)+"\n```");
			}
			break;

		case 'die' :
			if(e.message.author.id !== "279207740340043776") return;
			console.log("Disconnecting...");
			discordie.disconnect();
			break;
	}
	
	}catch(err){e.message.channel.sendMessage("```"+err.message+"```");}
});