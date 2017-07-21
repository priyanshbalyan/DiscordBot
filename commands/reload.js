exports.run = (e, params, discordie) => {
	if(!params || params.length < 1) return e.message.channel.sendMessage("No command name provided to reload");

	delete require.cache[require.resolve('./'+params[0]+'.js')];
	e.message.channel.sendMessage("Command **"+params[0]+"** reloaded.");
}