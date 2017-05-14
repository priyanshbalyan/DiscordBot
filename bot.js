var request = require('request');

var Discordie = require('discordie');

const Events = Discordie.Events;
const discordie = new Discordie();

discordie.connect({
	token: 'Mjg5Nzc2MDA1NTA0MDQwOTYw.C6cGiQ.iaHDAH9tIrNiC-LAnjBPur05GCI'
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
	const data = {
  		"description": e.message.content,
  		"author": {
    	"name": e.message.author.username,
    	"url": "https://discordapp.com",
    	"icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
  		}
  	}

	e.message.channel.sendMessage(e.message.author.username+" deleted their message", false, data);
});

//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e=>{
	//console.log(e.message.author.username);     
	var mention = '@'+e.message.author.username+'#'+e.message.author.discriminator;
	switch(e.message.content){
		case 'PING' : e.message.channel.sendMessage('PONG');
			break;
		case 'BOT' : e.message.reply('Sup '+e.message.author.username+' I\'m a bot created by my senpai Raiden. Currently I\'m in alpha stage.');
			break;
		case 'RIP' : e.message.channel.sendMessage('Rip indeed');
			break;
		case 'NSFW' : e.message.channel.sendMessage('U wanna fap boi?');
			break;
		case 'HELP' : e.message.channel.sendMessage('Ma current commands are ```PING BOT RIP NSFW```');
			break;
		case 'WEATHER' : e.message.channel.sendMessage(weather('London'));
	}
});

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

