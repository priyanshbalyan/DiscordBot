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

module.exports = {

	cleancode:function(text){
		if(typeof(text) === "string")
			return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g,"@"+String.fromCharCode(8203));
		return text;
	},

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
						"name": "Online",
						"value": guild.members.filter(m=>m.status=="online").length,
						"inline": true
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

	getperms:function(e){
		if(e.message.mentions.length>0) var user = e.message.mentions[0];
		else var user = e.message.author;
		const guildPerms = user.permissionsFor(e.message.guild);
		var embed =  {
			"color":123134,
			"description": "Permissions granted to "+user.mention+" : ",
			"fields": [
				{"name":"General Permissions", "value": Object.keys(guildPerms.General).filter(m=>guildPerms.General[m] == true).join("\n"), "inline":true},
				{"name":"Text Permissions", "value": Object.keys(guildPerms.Text).filter(m=>guildPerms.Text[m] == true).join("\n"), "inline":true}
			]
		};
		e.message.channel.sendMessage(" ",false,embed);
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
					"description":":revolving_hearts:  "+resp.result+"\n\nHearts: "+s
				};
			}else var embed = {"description": "Can't fetch love data."};
			
			e.message.channel.sendMessage(" ", false, embed);
		});
	},

	urban:function(e, term){
		var options = {
			url:"https://mashape-community-urban-dictionary.p.mashape.com/define?term="+term,
			headers:{
				"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
			}
		};
		request(options, (err,res,body) => {
			if(!err){
				var resp = JSON.parse(body);
				//console.log(resp);
				var embed = {
					"color":123134,
					"author":{
						"name": "Defintion for \""+term+"\" by "+resp.list[0].author
					},
					"description":resp.list[0].definition,
					"thumbnail":{
						"url":"http://error.urbandictionary.com/logo.png?width=89&height=29"
					},
					"fields":[{
						"name":"Examples",
						"value":resp.list[0].example
					}],
					"footer":{
						"text":resp.list[0].thumbs_up+" :thumbsup: | :thumbsdown: "+resp.list[0].thumbs_down
					}
				};
				
			}else var embed = {"description": "Can't fetch data from urban dictionary"};
			
			e.message.channel.sendMessage(" ", false, embed);
		});
	},

	yomama:function(e, usr){
		var url = "https://api.apithis.net/yomama.php";
		request(url, (err,res,body) => {
			if(!err){
			//	console.log(body);
				var str = usr+", "+body;
			}else
				var str = "Can't fetch data.";
			e.message.channel.sendMessage(str);
		});
	},

	googlesearch:function(e, params){
		var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCaGnVEJoO7JJLaIafX5t1dYYeRjSED8tw&cx=017477852080590256610:hyzdrv6behg&q="+params.join(" ");
		request(url, (err,res,body) => {
			if(!err){
				var resp = JSON.parse(body);
				//console.log(resp);
				var str = resp.items[0].title+"\n"+resp.items[0].link
						+"\n\n**See also:**\n<"+resp.items[1].link+">\n<"+resp.items[2].link+">";
				
			}else var str = "Can't fetch data from google.";
			
			e.message.channel.sendMessage(str);
		});
	},

	botinfo:function(e){
		var embed = {

		}
		e.message.channel.sendMessage(" ", false, embed);
	},

	helpmsg:function(e, prefix, avatar){
		var embed = {
			"color":123134,
			"author":{
				"name":"Commands available",
				"icon_url":avatar
			},
			//"timestamp":Date.now(),
			"description":"Use "+prefix+" as a prefix for these commands",
			"fields":[
				{
					"name": "New Commands",
					"value":"**yomama, google, selfrolelist, addrole, removerole, mute, unmute**"
				},
				{
					"name":"Interesting", 
					"value":"**yomama** Makes a yo mama joke\n**google** Do a google search with the given words\n**lovecalc** Calculate love between mentioned users\n**weather** Shows weather of a location\n**quote** Get a random quote\n**urban** Gets definition of a word from urban dictionary\n**rng** Get a random number\n**flipcoin** Head or Tail?\n**tag** Create ur own tag commands with this command (Use command for more info)\n**8ball** Ask 8ball anything\n**say** Make the bot say something\n"
				},
				{
					"name":"Moderation Perks", 
					"value":"**set** Set and reset features of the bot for the guild (Use command for more info)\n**kick** Kicks mentioned user out of the guild\n**ban** Bans the mentioned user from the guild\n**mute** Mutes the mentioned user for specified time\n**unmute** Unmutes the mentioned user\n**purge** Purge number of specified messages in a channel"
				},
				{
					"name":"Utilities", 
					"value":"**ping** Checks for bot ping time\n**clean** Cleans bot messages\n**avatar** Gets user avatar\n**getroles** Get roles of the mentioned user\n**getperms** Get perms for the mentioned user\n**serverinfo** Get Information for the guild\n**userinfo** Gets mentioned user's information\n**emote** Gets the direct link for an emote\n**invite** Invite this bot to your server"
				},
				{
					"name":"Roles", 
					"value":"**selfrolelist** Gets list of self-assignable roles for the guild (Has to be set before by a mod using ``set selfrole <rolename>``\n**addrole** Assigns the role to the user if its set as a self-assignable role\n**removerole** Remove the self assignable role from the user"
				}
			],
			"thumbnail":{
				"url":avatar
			}
		};
		e.message.channel.sendMessage(" ", false, embed);
	}

};