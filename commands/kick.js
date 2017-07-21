exports.run = (e, params, discordie) => {
	if(e.message.mentions.length>0){
		if(!discordie.User.can(2, e.message.guild)) return e.message.channel.sendMessage("I don't have enough permissions to kick. ``Required Perm: KICK_MEMBERS``");
		if(e.message.author.can(2, e.message.guild))
			e.message.mentions[0].memberOf(e.message.guild).kick()
			.then(()=>e.message.channel.sendMessage("***"+e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been kicked!***"))
			.catch(err=>e.message.channel.sendMessage("Can't kick member.\n"+err.message));
		else
			console.log("user doesn't have the perms to kick");
	}else
		e.message.channel.sendMessage("You didn't provide a user to kick.");
}