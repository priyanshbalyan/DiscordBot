exports.run = (e, params, discordie) => {
	if(!e.message.author.can(8192, e.message.guild)) return;
	if(!discordie.User.can(8192, e.message.guild)) return e.message.channel.sendMessage("I don't have the permissions to purge messages. ``Required Perm: MANAGE_MESSAGES``");
	if(!params[0] || parseInt(params[0])==NaN) return e.message.channel.sendMessage("You need to provide a number of messages to purge.");
	
	e.message.channel.fetchMessages().then(obj => {
		let msgarray = obj.messages;
		msgarray.length = parseInt(params[0])+1;
		discordie.Messages.deleteMessages(msgarray).catch(console.error);
		//msgarray.map(m => m.delete().catch(console.error));
	}).catch(console.error);
}