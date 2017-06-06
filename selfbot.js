var Discordie = require('discordie');
var request = require('request');

var Utilities = require('./modules/Utilities.js')
const Events = Discordie.Events;

const discordie = new Discordie();

var prefix = "]";

var Key = require('./key.js'); //Needed for getting token from a file
discordie.connect({
	token: Key.getToken() //paste your own token here instead of Key.getToken()
});

discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("Selfbot connected.");
});

discordie.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	console.log(e.message.content);
	if(!e.message.content.startsWith(prefix)) return;
	if(e.message.author !== discordie.User) {console.log("fire2");return;}
	else console.log("reject");
	
	console.log("test");
	var cmd = e.message.content.split(' ')[0].split("");
	const params = e.message.content.split(' ').slice(1);
	cmd.shift();
	cmd = cmd.join("");
	
//	var msgrepeat;
//	var randwait;
	try{
		switch(cmd){
			case "ping": e.message.channel.sendMessage("Pong");
			break;
			/*case "startfishing" :
				msgrepeat = setInterval(()=>{
					randwait = setTimeout(()=>{
					e.message.channel.sendMessage("t!fish");
					},Math.random()*10000);

				},30000);
				break;;
				
			case "stopfishing" :
				clearInterval(msgrepeat);
				clearTimeout(randwait);
				break;
*/
			case "clean" : 
			e.message.channel.fetchMessages()
			.then(obj => {
				let msgarray = obj.messages;
				msgarray = msgarray.filter(m => m.author.id === discordie.User.id);   //ES2017 syntax
				msgarray.length = 10 + 1;
				msgarray.map(m => m.delete().catch(console.error));
			});

			break;

			case "serverinfo" :
			var guild = e.message.guild;
			var data = {
				"color": 123134,
				"author":{
					"name": guild.name,
					"url": guild.iconURL,
      				"icon_url": guild.iconURL
				},
				"timestamp": guild.createdAt,
				"footer":{
					"text": "Created"
				},
				"thumbnail":{
					"url": guild.iconURL
				},
				"fields":[
					{
						"name": "Owner",
						"value": discordie.Users.get(guild.owner_id).username+"#"+discordie.Users.get(guild.owner_id).discriminator
					},
					{
						"name": "No. of Members",
						"value": guild.member_count
					},
					{
						"name": "Region",
						"value": guild.region
					},
					{
						"name": "Text Channels: "+guild.textChannels.length,
						"value": guild.textChannels.map(m=>m.mention).join(", ")
					},
					{
						"name": "Voice Channels: "+guild.voiceChannels.length,
						"value": guild.voiceChannels.map(m=>m.name).join(", ")
					},
					{
						"name": "Roles: "+guild.roles.length,
						"value": guild.roles.map(m=>m.name).join(", ")
					}

				]

			};
			e.message.channel.sendMessage(" ",false,data);
			break;

			case "userinfo" :
			if(e.message.mentions.length>0) var user = e.message.mentions[0];
			else var user = e.message.author;
			var embed = {
				"color":123134,
				"author":{
					"name":user.username+"#"+user.discriminator,
					"icon_url":user.avatarURL
				},
				"timestamp": user.registeredAt,
				"footer":{
					"text": "Created"
				},
				"thumbnail":{
					"url":user.avatarURL
				},
				"fields":[
					{
						"name":"ID",
						"value":user.id,
						"inline":true
					},
					{
						"name":"Nickname",
						"value":(user.memberOf(e.message.guild).nick)||"No Nickname",
						"inline":true
					},
					{
						"name":"Playing",
						"value":(user.gameName)||"n/a",
						"inline":true
					},
					{
						"name":"Status",
						"value":user.status,
						"inline":true
					},
					{
						"name":"Joined",
						"value":user.memberOf(e.message.guild).joined_at,
						"inline":true
					},
					{
						"name":"Roles",
						"value":(user.memberOf(e.message.guild).roles.map(m=>m.role).join(", "))||"No Roles",
						"inline":true
					}
				]
			};
			e.message.channel.sendMessage(" ",false,embed);
			break;

			case "quote" : Utilities.quote(e);
			break;

			case "weather" : Utilities.weather(e,params);
			break;

			case "8ball" :
			if(params != "")
				fembed(e, Utilities.eightball()+", "+e.message.author.username, "");
			else
				e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``"+prefix+"8ball <question>``");
			break;

			case "lovecalc" :
			if(e.message.mentions.length>=2){
				var fname = e.message.mentions[0].username;
				var sname = e.message.mentions[1].username;
				Utilities.lovecalc(e, fname,sname);
			}else
				e.message.channel.sendMessage("The Correct usage is\n``"+prefix+"lovecalc <mention1> <mention2>``");
			break;

			case "avatar" :
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

		}
	}catch(err){e.message.channel.sendMessage(err.message);}
	
});
