exports.run = (e, params, discordie) => {
	var user = (e.message.mentions[0]) ? e.message.mentions[0] : e.message.author;
	var embed = {
		"color":123134,
		"author":{
			"name": user.username+" #"+user.discriminator,
			"url": user.avatarURL
		},
		"image":{
			"url":user.avatarURL+"?size=1024"
		}
	};
	e.message.channel.sendMessage(" ",false,embed);
}