var request = require('request');

exports.run = (e, params, discordie) => {
	if(!params || params.length<1) return e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``]weather <location>``"); 
	
	var url = 'http://api.openweathermap.org/data/2.5/weather?q=';
	var key = '&APPID=25344f47dd3bf2225d2474ac80c139ca';
	var location = params.join(" ");

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
}