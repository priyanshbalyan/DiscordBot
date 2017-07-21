exports.run = (e, params, discordie) => {
	if(!params[0] || parseInt(params[0])==NaN) var n = 100;
	else var n = parseInt(params[0]);

	e.message.channel.fetchMessages().then(obj => {
		let msgarray = obj.messages;
		msgarray = msgarray.filter(m => m.author.id === discordie.User.id);
		msgarray.length = n + 1;
		//discordie.Messages.deleteMessages(msgarray).catch(console.error);
		msgarray.map(m => m.delete().catch(console.error));
	});
}