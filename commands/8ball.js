exports.run = (e, params, discordie) => {
	var ballreplies = [
	"Ask again later",
	"My reply is no",
	"It is decidedly so",
	"It is certain",
	"Outlook not so good",
	"You may rely on it",
	"Signs point to yes",
	"Better not tell you now",
	"Don't count on it",
	"Outlook good",
	"As I see it, yes",
	"Without a doubt",
	"Very doubtful",
	"Concentrate and ask again",
	"Yes, definitely"
	];

	ballreply = ballreplies[Math.round(Math.random()*ballreplies.length)];
	
	if(params != "")
		e.message.channel.sendMessage(ballreply+", "+e.message.author.username);
	else
		e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``]8ball <question>``");
}