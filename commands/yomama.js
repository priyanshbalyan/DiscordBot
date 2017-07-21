var request = require('request');

exports.run = (e, params, discordie) => {
	var url = "https://api.apithis.net/yomama.php";
	usr = e.message.mentions[0]?e.message.mentions[0].username : e.message.author.username;
	request(url, (err,res,body) => {
		if(!err){
			//	console.log(body);
			str = usr+", "+body;
		}else
			str = "Can't fetch data.";
		e.message.channel.sendMessage(str);
	});
	
}