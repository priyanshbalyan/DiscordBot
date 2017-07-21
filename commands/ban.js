exports.run = (e, params, discordie) => {
	if(e.message.mentions.length>0){
		if(!discordie.User.can(4, e.message.guild)) return e.message.channel.sendMessage("I don't have enough permissions to ban. ``Required Perm: BAN_MEMBERS``");
		if(e.message.author.can(4, e.message.guild))
			e.message.guild.ban(e.message.mentions[0], 1)
			.then(()=>e.message.channel.sendMessage("***"+e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been banned!***"))
			.catch(err=>e.message.channel.sendMessage("Can't ban member.\n"+err.message));
		else
			console.log("user doesn't have the perm to ban");
	}else
		e.message.channel.sendMessage("You didn't provide a user to ban.");
}