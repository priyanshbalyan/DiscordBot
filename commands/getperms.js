exports.run = (e, params, discordie) => {
	if(e.message.mentions.length>0) var user = e.message.mentions[0];
	else var user = e.message.author;
	const guildPerms = user.permissionsFor(e.message.guild);
	var embed =  {
		"color":123134,
		"description": "Permissions granted to "+user.mention+" : ",
		"fields": [
			{"name":"General Permissions", "value": Object.keys(guildPerms.General).filter(m=>guildPerms.General[m] == true).join("\n"), "inline":true},
			{"name":"Text Permissions", "value": Object.keys(guildPerms.Text).filter(m=>guildPerms.Text[m] == true).join("\n"), "inline":true}
		]
	};
	e.message.channel.sendMessage(" ",false,embed);
}