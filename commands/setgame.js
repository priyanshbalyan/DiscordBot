exports.run = (e, params, discordie) => {
	if(e.message.author.id !== "279207740340043776") return;
	var game = {"name": params.join(" ")};
	discordie.User.setGame(game);
}