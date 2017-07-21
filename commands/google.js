var request = require('request');

exports.run = (e, params, discordie) => {
	if(!params || params.length <1) return e.message.channel.sendMessage("No search term provided.");
	var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCaGnVEJoO7JJLaIafX5t1dYYeRjSED8tw&cx=017477852080590256610:hyzdrv6behg&q="+params.join("+");
	request(url, (err,res,body) => {
	if(!err){
		var resp = JSON.parse(body);
		//console.log(resp);
		var str = resp.items[0].title+"\n"+resp.items[0].link
				+"\n\n**See also:**\n<"+resp.items[1].link+">\n<"+resp.items[2].link+">";		
	}else var str = "Can't fetch data from google.";	
		e.message.channel.sendMessage(str);
	});
}