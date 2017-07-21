exports.run = (e, params, discordie) => {
	e.message.channel.sendMessage(params.join(" "));
	console.log(e.message.attachments);
}