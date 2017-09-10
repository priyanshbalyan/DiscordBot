const request = require('request');

exports.run = (e, params, discordie) => {
    if (!/nsfw/.exec(e.message.channel.name))
        return e.message.channel.sendMessage("Channel is not nsfw");

    var url = "http://www.reddit.com/r/hentai/new.json?sort=new";
    var images = [];

    request(url, (err, res, body) => {
        if (!err) {
            var resp = JSON.parse(body);
            resp.data.children.forEach(function(element) {
                if (element.data.hasOwnProperty("preview"))
                    images.push(element.data.preview.images[0].source.url);
            });
            console.log(resp.data.children[0].data.preview.images[0].source.url);

            e.message.channel.sendMessage(images[Math.round(Math.random() * images.length)]);
        } else 
        	e.message.channel.sendMessage("Error fetching nsfw content.");
    });

}