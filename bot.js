//var request = require('request');

var Discordie = require('discordie');

const Events = Discordie.Events;
const discordie = new Discordie();

var prefix = "]";

discordie.connect({
	token: 'Mjg5Nzc2MDA1NTA0MDQwOTYw.C_s5mQ.nG89AeHb9eSiVU0gMwF4Op7oFC0'
});

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("connected as " + discordie.User.username);
});

//New member joined the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
	e.message.channel.sendMessage('Welcome!');
});

//member left the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
	e.message.channel.sendMessage('A User has left this channel.');
});

discordie.Dispatcher.on(Events.MESSAGE_DELETE, e => {
	embed(e, e.message.content, "delete");
});

commands = ['ping', 'rng', 'flipcoin', 'help', 'profile', 'weather', 'kick', 'mute', 'ban'];
desc = ['Check ping', 'Gives a random number', 'Flips a coin', 'Shows this message', 'Shows user profile', 'Get waether info of a place', 'Kicks a user out of the server', 'Mutes a user for a selected time', 'Bans a user'];
//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e=>{
	//console.log(e.message.author.username);     
	
	if(!e.message.content.startsWith(prefix)) return;
	
	var cmd = e.message.content.split(' ')[0].split("");
	cmd.shift();
	cmd = cmd.join("");
	try{
	switch(cmd){
		case commands[0] : e.message.channel.sendMessage('Pong!');
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
			embed(e, str, " ");
			break;
		case commands[4] : 
			break;
		case commands[5] : e.message.channel.sendMessage(weather('London'));
		break;
	}
	
	}catch(err){e.message.channel.sendMessage("```"+err.message+"```");}
});

function embed(e, content, event){
	const data = {
  		"description": content,
  		"author": {
    	"name": e.message.author.username,
    	"url": "https://discordapp.com",
    	"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
        }
	};
	
	if(event == "delete")
		e.message.channel.sendMessage(e.message.author.username+" deleted their message", false, data);
	else
		e.message.channel.sendMessage(" ",false,data);
}

function weather(location){
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
	var key = '&APPID=25344f47dd3bf2225d2474ac80c139ca';
	var s = '';
	request(url+location+key , (err, res, body) => {
    if (!err) {
    	console.log(body);
     	clocation = body.name +", "+ body.sys.country;
		cweather = body.weather.description;
		ctemp = body.main.temp -273.15;
		chumidity = body.main.humidity;
		s = 'Weather is '+cweather+' at '+clocation+' with temperature at '
		 	+ctemp+' C '+' and '+chumidity+' humidity.';
  	} else{
   		console.log(err);
		}
	});
	return s;
}