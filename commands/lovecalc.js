var request = require('request');

exports.run = (e, params, discordie) => {
	if(e.message.mentions.length>=2){
		fname = e.message.mentions[0].username;
		sname = e.message.mentions[1].username;
	}else if(params.length == 2){
		fname = params[0];
		sname = params[1];
	}else
		return e.message.channel.sendMessage("The correct usage is ``]lovecalc <name or mention 1> <name or mention 2>``");

	var options = {
		url:"https://love-calculator.p.mashape.com/getPercentage?fname="+fname+"&sname="+sname,
		headers:{
			"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
		}
	};

	try{
	request(options, (err,res,body)=>{
		if(!err){
			var resp = JSON.parse(body);
			//console.log(resp);
			s = "";
			i=resp.percentage;
			while(i>0){
				s+=":two_hearts:";
				i-=20;
			}

			var embed = {
				"color":123134,
				"author":{
					"name": "Love between "+resp.fname+" and "+resp.sname+" is "+resp.percentage+"%"
				},
				"description":":revolving_hearts:  "+resp.result+"\n\nHearts: "+s
			};
		}else var embed = {"description": "Can't fetch love data."};
		
		e.message.channel.sendMessage(" ", false, embed);
	});
	}catch(err){
		console.log(err);
	}
}