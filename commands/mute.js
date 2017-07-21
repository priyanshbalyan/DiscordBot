exports.run = (e, params, discordie) => {
	if(!e.message.author.can(2|4|16|32|268435456, e.message.guild)) return;
	if(!discordie.User.can(268435456, e.message.guild)) return e.message.channel.sendMessage("I don't have enough permissions to mute. ``Required Perm: MANAGE_ROLES``")
	if(e.message.mentions.length == 0) return e.message.channel.sendMessage("No user specified.");
	if(e.message.mentions[0].can(2|4|16|32|268435456, e.message.guild)) return e.message.channel.sendMessage("Can't mute a mod or admin");
	if(!params[1] || parseInt(params[1]) == NaN) return e.message.channel.sendMessage("No time specified");

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
		e.message.channel.sendMessage(e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been muted for "+parseInt(params[1])+" minutes.");

	muteTimeout = setTimeout(()=>{
		role = e.message.guild.roles.find(r => r.name == "Muted");
		e.message.mentions[0].memberOf(e.message.guild).unassignRole(role);
		e.message.channel.sendMessage(e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been unmuted. (Mute timeout)");
	},parseInt(params[1])*60000);
}