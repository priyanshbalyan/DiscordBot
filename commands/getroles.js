exports.run = (e, params, discordie) => {
	var guildmember = (e.message.mentions[0]) ? discordie.Users.getMember(e.message.guild,e.message.mentions[0]) : e.message.member;
	var roleNames = guildmember.roles.map(role => role.name);
	var str = (roleNames.join("\n") || "No Roles");
	var embed = {
		"color":123134,
		"author":{
			"name": guildmember.name+"'s Roles",
		},
		"description":str
	};
	e.message.channel.sendMessage(" ", false, embed);
}