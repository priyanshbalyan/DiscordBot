exports.run = (e, params, discordie) => {
	var user = (e.message.mentions[0]) ? e.message.mentions[0] : e.message.author;

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
				"url": user.avatarURL
			},
			"fields":[
				{
					"name":"ID",
					"value":user.id,
					"inline":true
				},
				{
					"name":"Nickname",
					"value":(user.memberOf(e.message.guild).nick)||"No nickname on this server",
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
					"value":(user.memberOf(e.message.guild).roles.map(role=>role.name).join(", "))||"No Roles",
					"inline":true
				}
			]
		};

	e.message.channel.sendMessage(" ", false, embed);
}