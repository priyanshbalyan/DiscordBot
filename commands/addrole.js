const fs = require('fs');

exports.run = (e, params, discordie) => {
	let settings = JSON.parse(fs.readFileSync("./settings.json","utf8"));
	
	var param = params.join(" ").toLowerCase();
	//Check if role is in the db of self-assignable roles
	role = settings[e.message.guild.id].selfroles.find(role=>role.toLowerCase()==param);
	if(role){
		role = e.message.guild.roles.find(r=>r.name.toLowerCase()==role.toLowerCase());
		if(e.message.member.roles.find(r=>r.name==role.name)){
			e.message.channel.sendMessage("You already have the role."); return;
		}
	
		e.message.member.assignRole(role);
		e.message.channel.sendMessage("You now have **"+role.name+"** role.");
	}else if(e.message.guild.roles.find(r=>r.name.toLowerCase()==param))
		e.message.channel.sendMessage("The role is not self-assignable.");
}