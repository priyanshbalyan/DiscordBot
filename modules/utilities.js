var request = require('request');

var ballreplies = [
	"Ask again later",
	"My reply is no",
	"It is decidedly so",
	"It is certain",
	"Outlook not so good",
	"You may rely on it",
	"Signs point to yes",
	"Better not tell you now",
	"Don't count on it",
	"Outlook good",
	"As I see it, yes",
	"Without a doubt",
	"Very doubtful",
	"Concentrate and ask again",
	"Yes, definitely"
	];

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

module.exports = {
	eightball: function(){
		return ballreplies[Math.round(Math.random()*ballreplies.length)];
	},
	guildinfo: function(guild, discordie){
		var embed = {
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
			return embed;
	},

	quote:function(e){
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
			return fembed(e,"Can't fetch quotes.","");
	});
}
};