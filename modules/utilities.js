var request = require('request');

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

function fembed(e, content, event){
	const data = {
  		"description": content,
  		"color": 123134,
  		"author": {
    	"name": e.message.author.username,
    	"url": "https://discordapp.com",
    	"icon_url": e.message.author.avatarURL
        }
	};
	
	if(event == "delete")
		e.message.channel.sendMessage(e.message.author.username+" deleted their message", false, data);
	else
		e.message.channel.sendMessage(" ",false,data);
}

module.exports = {
	eightball: function(){
		return ballreplies[Math.round(Math.random()*ballreplies.length)];
	},
	guildinfo: function(guild, discordie){
		var embed = {
				"color": 123134,
				"author":{
					"name": guild.name,
					"url": guild.iconURL,
      				"icon_url": guild.iconURL
				},
				"timestamp": guild.createdAt,
				"footer":{
					"text": "Created"
				},
				"thumbnail":{
					"url": guild.iconURL
				},
				"fields":[
					{
						"name": "Owner",
						"value": discordie.Users.get(guild.owner_id).username+"#"+discordie.Users.get(guild.owner_id).discriminator
					},
					{
						"name": "No. of Members",
						"value": guild.member_count,
						"inline":true
					},
					{
						"name": "Region",
						"value": guild.region,
						"inline":true
					},
					{
						"name": "Text Channels: "+guild.textChannels.length,
						"value": guild.textChannels.map(m=>m.mention).join(", ")
					},
					{
						"name": "Voice Channels: "+guild.voiceChannels.length,
						"value": guild.voiceChannels.map(m=>m.name).join(", ")
					},
					{
						"name": "Roles: "+guild.roles.length,
						"value": guild.roles.map(m=>m.name).join(", ")
					}

				]

			};
			return embed;
	},
	
	userinfo:function(e, user){
		var embed = {
			"color":123134,
			"author":{
				"name":user.username+"#"+user.discriminator,
				"icon_url":user.avatarURL
			},
			"timestamp": user.registeredAt,
			"footer":{
				"text": "Created"
			},
			"thumbnail":{
				"url": user.avatarURL
			},
			"fields":[
				{
					"name":"ID",
					"value":user.id,
					"inline":true
				},
				{
					"name":"Nickname",
					"value":(user.memberOf(e.message.guild).nick)||"No nickname on this server",
					"inline":true
				},
				{
					"name":"Playing",
					"value":(user.gameName)||"n/a",
					"inline":true
				},
				{
					"name":"Status",
					"value":user.status,
					"inline":true
				},
				{
					"name":"Joined",
					"value":user.memberOf(e.message.guild).joined_at,
					"inline":true
				},
				{
					"name":"Roles",
					"value":(user.memberOf(e.message.guild).roles.map(role=>role.name).join(", "))||"No Roles",
					"inline":true
				}
			]
		};

		return embed;
	},

	quote:function(e){
		var options = {
			url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
			headers:{
				"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
			}
		};
		request(options, (err, res, body) => {
			if(!err){
				var resp = JSON.parse(body);
				console.log(body);
				var embed = {
					"color": 123134,
					"author":{
						"name": resp.quote,
					},
					"footer":{
						"text": resp.author+" | "+resp.category
					}
				};
			}
			else
				var embed = {
					"description": "Can't fetch quotes."
				}
			e.message.channel.sendMessage(" ",false,embed);
		});
	},

	weather:function(e, location){
		var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
		var key = '&APPID=25344f47dd3bf2225d2474ac80c139ca';

		request(url+location+key , (err, res, body) => {
	    	if (!err) {
    			var resp = JSON.parse(body);
    			//console.log(body);
    			if(resp.hasOwnProperty("cod"))
    				if(resp.cod == "404")
    					return {"description":resp.message}
			 	var embed = {
		 			"color": 123134,
		 			"author": {
			 			"name":"Weather at "+resp.name+", "+resp.sys.country
		 			},
		 			"thumbnail":{
		 				"url": "http://openweathermap.org/img/w/"+resp.weather[0].icon+".png"
		 			},
		 			"fields": [
			 			{
		 					"name": resp.weather[0].main,
			 				"value": resp.weather[0].description
		 				},
			 			{
			 				"name": "Current Temperature",
		 					"value": (resp.main.temp-273.15).toFixed(2)+"°C",
		 					"inline":true
		 				},
		 				{
			 				"name": "Max/Min Temperature",
		 					"value": (resp.main.temp_max-273.15).toFixed(2)+"°C / "+(resp.main.temp_min-273.15).toFixed(2)+"°C",
		 					"inline":true
		 				},
		 				{
			 				"name": "Humidity",
			 				"value": resp.main.humidity+"%",
		 					"inline":true
		 				},
		 			]
		 		};
  			} else{
	   			var embed = {
   					"description": "Can't fetch weather data."
   				};
			}
			
			e.message.channel.sendMessage(" ", false, embed);
		});
	},

	lovecalc:function(e,fname,sname){
		var options = {
			url:"https://love-calculator.p.mashape.com/getPercentage?fname="+fname+"&sname="+sname,
			headers:{
				"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
			}
		};
		request(options, (err,res,body)=>{
			if(!err){
				var resp = JSON.parse(body);
				//console.log(resp);
				s = ""; i=resp.percentage; while(i>0){s+=":two_hearts:";i-=20;}
				var embed = {
					"color":123134,
					"author":{
						"name": "Love between "+resp.fname+" and "+resp.sname+" is "+resp.percentage+"%"
					},
					"description":":revolving_hearts:  "+resp.result+"\n"+s
				};
			}else{
				var embed = {
					"description": "Can't fetch love data."
				};
			}
			e.message.channel.sendMessage(" ", false, embed);
		});
	}

};