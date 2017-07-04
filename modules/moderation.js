var muteTimeout;

module.exports = {
	kick:function(e, discordie){
		if(e.message.mentions.length>0)
			if(!discordie.User.can(2, e.message.guild)){ e.message.channel.sendMessage("I don't have enough permissions to kick. ``Required Perm: KICK_MEMBERS``"); return; }
			if(e.message.author.can(Discordie.Permissions.General.KICK_MEMBERS, e.message.guild))
				e.message.mentions[0].memberOf(e.message.guild).kick().then(()=>e.message.channel.sendMessage("***"+e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been kicked!***"))
				.catch(err=>e.message.channel.sendMessage("Can't kick member.\n"+err.message));
			else
				console.log("user doesn't have the perms to kick");
	},

	ban:function(e, discordie){
		if(e.message.mentions.length>0)
			if(!discordie.User.can(4, e.message.guild)){ e.message.channel.sendMessage("I don't have enough permissions to ban. ``Required Perm: BAN_MEMBERS``"); return; }
				if(e.message.author.can(Discordie.Permissions.General.BAN_MEMBERS, e.message.guild))
					e.message.guild.ban(e.message.mentions[0], 1).then(()=>e.message.channel.sendMessage("***"+e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been banned!***")).catch(err=>e.message.channel.sendMessage("Can't ban member.\n"+err.message));
				else
					console.log("user doesn't have the perm to ban");
	},

	mute:function(e, params, discordie){
		//Checking for possible cases
		if(!e.message.author.can(2|4|16|32|268435456, e.message.guild)) return;
		if(!discordie.User.can(268435456, e.message.guild)){ e.message.channel.sendMessage("I don't have enough permissions to mute. ``Required Perm: MANAGE_ROLES``"); return; }
		if(e.message.mentions.length == 0){ e.message.channel.sendMessage("No user specified."); return; }
		if(e.message.mentions[0].can(2|4|16|32|268435456, e.message.guild)){ e.message.channel.sendMessage("Can't mute a mod or admin"); return; }
		if(!params[1] || parseInt(params[1]) == NaN){ e.message.channel.sendMessage("No time specified"); return; }

		Role = e.message.guild.roles.find(r => r.name == "Muted");
		if(!Role) //If Muted role doesnt exist in guild, create one with required permissions
			e.message.guild.createRole().then(role=>{
				var perms = role.permissions;
				perms.Text.SEND_MESSAGES = false;
				perms.Text.ATTACH_FILES = false;
				perms.Text.SEND_TTS_MESSAGES = false;
				role.commit("Muted", "000000", "true", "false");
				e.message.mentions[0].memberOf(e.message.guild).assignRole(role);
				console.log("role created");

				//Creating Muted permission overwrite for each channel in the guild (SEND_MESSAGES = false)
				e.message.guild.channels.forEach(ch=>{
					ch.createPermissionOverwrite(role, 1024, 2048).then(overwrite=>console.log("Successful perm overwrite for channel "+ch.name)).catch(err=>console.log(err));
				});
				
				e.message.channel.sendMessage("Muted role with necessary permissions have been created successfuly for "+e.message.guild.name);
			}).catch(err => console.log("Failed to create role:",err));			
		else
			e.message.mentions[0].memberOf(e.message.guild).assignRole(Role);
			e.message.channel.sendMessage(params[0]+" has been muted for "+parseInt(params[1])+" minutes.");

		muteTimeout = setTimeout(()=>{
			role = e.message.guild.roles.find(r => r.name == "Muted");
			e.message.mentions[0].memberOf(e.message.guild).unassignRole(role);
			e.message.channel.sendMessage(params[0]+" has been unmuted. (Mute timeout)");
		},parseInt(params[1])*60000);
	},

	unmute:function(e, params){
		if(!e.message.author.can(2|4|16|32|268435456, e.message.guild)) return;
		role = e.message.member.roles.find(r=>r.name=="Muted");
		if(role){
			e.message.mentions[0].memberOf(e.message.guild).unassignRole(role);
			e.message.channel.sendMessage(params[0]+" has been unmuted.");
		}else e.message.channel.sendMessage("The user isn't muted.");
		clearTimeout(muteTimeout);
	},

	purge:function(e, params, discordie){
		if(!e.message.author.can(8192, e.message.guild)) return;
		if(!discordie.User.can(8192, e.message.guild)) { e.message.channel.sendMessage("I don't have the permissions to purge messages. ``Required Perm: MANAGE_MESSAGES``"); return; }
		if(!params[0] || parseInt(params[0])==NaN) { e.message.channel.sendMessage("You need to provide a number of messages to purge."); return;}
		e.message.channel.fetchMessages().then(obj => {
			let msgarray = obj.messages;
			msgarray.length = parseInt(params[0]);
			msgarray.map(m => m.delete().catch(console.error));
		}).catch(console.error);
	}
};