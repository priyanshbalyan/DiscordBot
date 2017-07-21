exports.run = (e, params, discordie) => {
	if(!e.message.author.can(2|4|16|32|268435456, e.message.guild)) return;
	if(!params || params.length<1) return e.message.channel.sendMessage("No user specified.");
	role = e.message.mentions[0].memberOf(e.message.guild).roles.find(r=>r.name=="Muted");
	if(role){
		e.message.mentions[0].memberOf(e.message.guild).unassignRole(role);
		e.message.channel.sendMessage(e.message.mentions[0].username+"#"+e.message.mentions[0].discriminator+" has been unmuted.");
	}else e.message.channel.sendMessage("The user isn't muted.");
	clearTimeout(muteTimeout);
}