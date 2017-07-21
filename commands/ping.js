exports.run = (e, params, discordie) => {
	var start = Date.now();
	 e.message.channel.sendMessage('Pong!').then(m=>m.edit('Pong! ``'+(Date.now()-start)+'ms``'));
}