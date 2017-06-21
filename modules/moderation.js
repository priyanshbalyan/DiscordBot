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
	}

	
};