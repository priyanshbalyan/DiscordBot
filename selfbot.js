var Discordie = require('discordie');

const Events = Discordie.Events;

const discordie = new Discordie();

var prefix = "]";

discordie.connect({
	token: 
});

discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("Selfbot connected.");
});

discordie.Dispatcher.on(Events.MESSAGE_CREATE, e => {
	if(e.message.content.startsWith(prefix) return;
	if(e.message.author !== discordie.user) return;
	
	var cmd = e.message.content.split(' ')[0].slice(1);
	cmd.shift();
	cmd = cmd.join('');
	
	var msgrepeat;
	var randwait;
	try{
		switch(cmd){
			case "startfishing" :
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

		}
	}catch(err){e.message.channel.sendMessage(err.message);}
	
}