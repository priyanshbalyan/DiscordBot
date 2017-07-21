const fs = require('fs');

exports.run = (e, params, discordie) => {
	let settings = JSON.parse(fs.readFileSync("./settings.json","utf8"));
	if(!settings[e.message.guild.id].hasOwnProperty("selfroles")) return e.message.channel.sendMessage("No self-assignable roles set on the server");
	var embed = {
		"color":123134,
		"author":{
			"name": "Self-assignable roles"
		},
		"description":(settings[e.message.guild.id].selfroles.join("\n")||"No Self-assignable roles set.")
	};
	e.message.channel.sendMessage(" ", false, embed);
}