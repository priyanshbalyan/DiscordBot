const fs = require('fs');

exports.run = (e, params, discordie) => {
	let settings = JSON.parse(fs.readFileSync("./settings.json","utf8"));

	role = settings[e.message.guild.id].selfroles.find(role=>role.toLowerCase()==params.join(" ").toLowerCase());
	if(!e.message.member.roles.find(r=>r.name==role)){ e.message.channel.sendMessage("You don't have **"+role+"** role"); return; }
	if(role){
		role = e.message.guild.roles.find(r=>r.name.toLowerCase()==role.toLowerCase());
		e.message.member.unassignRole(role);
		e.message.channel.sendMessage("You no longer have **"+role.name+"** role.");
	}
}