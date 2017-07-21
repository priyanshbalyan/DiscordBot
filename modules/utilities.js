module.exports = {

	fembed:function fembed(e, str){
		var data = {
  			"description": e.message.content,
  			"color": 123134,
  			"author": {
	    		"name": e.message.author.username,
    			"url": e.message.author.avatarURL,
    			"icon_url": e.message.author.avatarURL
        	},
        	"footer":{
	        	"text": "Deleted"
        	},
        	"timestamp": e.message.timestamp
		};
		//console.log(e.message.attachments[0]);
		if(e.message.attachments.length > 0)
			if(str == "delete") data.description= e.message.content + "(Deleted attachment)";
			else data["image"] = {"url": e.message.attachments[0].url};

		if(e.message.embeds.length>0) return e.message.embeds[0];
		
		if(str == "delete") {data.footer.text = "Deleted" ; return data;}
		if(str == "starred") {data.footer.text = "Starred"; return data;}
		
		e.message.channel.sendMessage(" ",false,{"description":str});
	},

	twitterService:function(discordie, settings){
		var twitterset = settings.twitter;
	
		if(twitterset.length<1) return;

		var Twitter = require('twitter');
		var client = new Twitter({
	  		consumer_key:"t1d82ckEM1GXFEvqdqfjynrQl",
   			consumer_secret:"bxsicbqU9wJIsYv0iSsnZa7XMVo9Q60DNpJsXKQ6PM8WiCK2Uo",
   			access_token_key:"99667189-zN9yjEKdarkgJcSDwXgL3JgD6GoUy28nb7kN5z6po",
   			access_token_secret:"BiIPvKCcBCQMvsaLorYwntWB1Wjuzdth51BTe4B8dzlpi"
		});

		for(var i=0 ; i<twitterset.length ; i++){
			var stream = client.stream('user', twitterset[i].handle); //twitterset.handle

			stream.on('data', function(event){
	   			console.log(event);
   				if(twitterset == null) stream.end();
				if(twitterset && event.user.name == twitterset.handle){
					discordie.Channels.get(twitterset[i].channel).sendMessage("New tweet : "+event.text);
				}
			});

			stream.on('error', function(error){
	   			console.log('error' + error);
			});
		}

	}		
	

};