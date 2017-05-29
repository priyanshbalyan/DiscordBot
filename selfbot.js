var Discordie = require('discordie');

const Events = Discordie.Events;

const discordie = new Discordie();

var prefix = "]";

discordie.connect({
	token: "PASTE_TOKEN_HERE"
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

			case "clean" : 
			e.message.channel.fetchMessages()
			.then(obj => {
				let msgarray = obj.messages;
				msgarray = msgarray.filter(m => m.author.id === discordie.User.id);   //ES2017 syntax
				msgarray.length = 100 + 1;
				msgarray.map(m => m.delete().catch(console.error));
			});

			break;

			case "serverinfo" :
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
	}catch(err){e.message.channel.sendMessage(err.message);}
	
}