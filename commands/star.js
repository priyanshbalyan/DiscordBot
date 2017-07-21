exports.run = (e, params, discordie) => {
	discordie.Messages.get(params[0]).addReaction(e.message.reactions[0].emoji);
}