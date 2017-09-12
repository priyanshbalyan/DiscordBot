const request = require('request');

exports.run = (e, params, discordie) => {
    if (!/nsfw/.exec(e.message.channel.name))
        return e.message.channel.sendMessage("Channel is not nsfw");

    let url = "http://www.reddit.com/r/hentai/new.json?sort=new";
    let images = [];
    let links = [];

    request(url, (err, res, body) => {
        if (!err) {
            var resp = JSON.parse(body);
            resp.data.children.forEach(function(element) {
                if (element.data.hasOwnProperty("preview")){
                    images.push(element.data.preview.images[0].source.url);
                    links.push("http://reddit.com"+element.data.permalink);
                }
            });
            console.log(resp.data.children[0].data.preview.images[0].source.url);

            let rand = Math.floor(Math.random() * images.length);
            let embed = {
                "author":{
                    "name":"Source",
                    "url":links[rand]
                },
                "image":{
                    "url":images[rand];
                }
            };
            e.message.channel.sendMessage("",false,embed);
        } else 
        	e.message.channel.sendMessage("Error fetching nsfw content.");
    });

}