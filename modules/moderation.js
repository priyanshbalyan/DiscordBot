

module.exports = {
	kick:function(e, Discordie){
		if(e.message.mentions.length>0)
			if(e.message.author.can(Discordie.Permissions.General.KICK_MEMBERS, e.message.guild))
				e.message.mentions[0].memberOf(e.message.guild).kick().then(()=>e.message.channel.sendMessage("***"+e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been kicked!***"))
				.catch(err=>e.message.channel.sendMessage("Can't kick member.\n"+err.message));
			else
				console.log("user doesn't have the perms to kick");
	},

	ban:function(e, Discordie){
		if(e.message.mentions.length>0)
			if(e.message.author.can(Discordie.Permissions.General.BAN_MEMBERS, e.message.guild))
				e.message.guild.ban(e.message.mentions[0], 1).then(()=>e.message.channel.sendMessage("***"+e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been banned!***")).catch(err=>e.message.channel.sendMessage("Can't ban member.\n"+err.message));
			else
				console.log("user doesn't have the perm to ban");
	},

	mute:function(e, params){
		Role = e.message.guild.roles.find(r => r.name == "Muted");
		if(!Role)
			e.message.guild.createRole().then(role=>{
				var perms = role.permissions;
				perms.Text.SEND_MESSAGES = false;
				perms.Text.ATTACH_FILES = false;
				perms.Text.SEND_TTS_MESSAGES = false;
				role.commit("Muted", "000000", "false", "false");
				e.message.mentions[0].memberOf(e.message.guild).assignRole(role);
			}).catch(err => console.log("Failed to create role:",err));
		else
			e.message.mentions[0].memberOf(e.message.guild).assignRole(Role);

		e.message.channel.sendMessage(e.message.mentions[0]+" has been muted.");

		muteTimeout = setTimeout(()=>{
			e.message.mentions[0].memberOf(e.message.guild).unassignRole(role);
			e.message.channel.sendMessage(e.message.mentions[0]+" has been unmuted.");
		},parseInt(params[1])*60000);
	},

	unmute:function(e, params){
		role = e.message.guild.roles.find(r=>r.name=="Muted");
		e.message.mentions[0].memberOf(e.message.guild).unassignRole(role);
		e.message.channel.sendMessage(e.message.mentions[0]+" has been unmuted.");
	}
};