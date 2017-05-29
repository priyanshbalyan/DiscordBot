var request = require('request');
var Discordie = require('discordie');

const Events = Discordie.Events;
const discordie = new Discordie();

var prefix = "]";

discordie.connect({
	token: 'PASTE_TOKEN_HERE'
});

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("connected as " + discordie.User.username);
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

commands = ['ping', 'rng', 'flipcoin', 'help', 'getroles', 'avatar', 'quote', 'weather', 'clean', '8ball', 'serverinfo'];
desc = ['Check ping', 'Gives a random number between 1 to 100', 'Flips a coin', 'Shows this message', 'Get the roles of the mentioned user', 'Shows user\'s avatar', 'Get a quote', 'Get weather data for a location \nUsage : ```weather <Location>```', 'Cleans messages', 'Ask 8ball anything', 'Get Server Info'];
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

		case commands[1] : embed(e, "Your random number is " + Math.round(Math.random()*100), " ");
			break;

		case commands[2] : embed(e, "Its " + (Math.random() > 0.5 ? "Heads" : "Tails"), " ");
			break;

		case commands[3] : var str = "Commands available : \n";
			for(var i=0 ; i<commands.length ; i++){
				str += "**"+commands[i]+"**" + "\n" ;
				str += desc[i] + "\n" ;
			}
			str += "Use "+prefix+" as a prefix for the commands.";
			embed(e, str, " ");
			break;
		
		case commands[4] : 
			if(params){
				var member = e.message.member;
				const roleNames = member.roles.map(role => role.name);
				var str = "Roles:\n"+(roleNames.join("\n") || "No Roles");
				embed(e,str,"");
			}

			break;
		
		case commands[5] : 
			if(e.message.mentions.length>0){
				e.message.channel.sendMessage(e.message.mentions[0].avatarURL);
			}else{
				e.message.channel.sendMessage(e.message.author.avatarURL);
			}
			break;
		
		case commands[6] : quote(e);
			break;
		
		case commands[7] : weather(e,params) ;
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
			var ball = require("./modules/8ball.js");
			e.message.channel.sendMessage(ball.eightball());
			break;

		case commands[10] :
			var guild = e.message.guild;
			const data = {
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
	}
	
	}catch(err){e.message.channel.sendMessage("```"+err.message+"```");}
});



function embed(e, content, event){
	const data = {
  		"description": content,
  		"color": 123134,
  		"author": {
    	"name": e.message.author.username,
    	"url": "https://discordapp.com",
    	"icon_url": e.message.author.avatar
        }
	};
	
	if(event == "delete")
		e.message.channel.sendMessage(e.message.author.username+" deleted their message", false, data);
	else
		e.message.channel.sendMessage(" ",false,data);
}


function quote(e){
	var options = {
		url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
		headers:{
			"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
		}
	};
	request(options, (err, res, body) => {
		if(!err){
		var resp = JSON.parse(body);
		console.log(body);
		return e.message.channel.sendMessage(resp.quote+"\n-"+resp.author);
		}
		else
			return e.message.channel.sendMessage(embed(e,"Can't fetch quotes.",""));
	});
}


function weather(e, location){
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
	var key = '&APPID=25344f47dd3bf2225d2474ac80c139ca';
	var s = '';
	request(url+location+key , (err, res, body) => {
    	if (!err) {
    		var resp = JSON.parse(res);
    		console.log(body);
     		clocation = resp.name +", "+ resp.sys.country;
			cweather = resp.weather.description;
			ctemp = resp.main.temp -273.15;
			chumidity = resp.main.humidity;
			s = 'Weather is '+cweather+' at '+clocation+' with temperature at '
		 	+ctemp+' C '+' and '+chumidity+' humidity.';
  		} else{
   			console.log(err.message);
   			s = "Can't fetch weather data.";
		}
		e.message.channel.sendMessage(s);
	});
	return s;
}