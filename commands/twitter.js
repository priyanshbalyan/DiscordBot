const fs = require('fs');
var Twitter = require('twitter');
const Config = require('../config.json');

var client = new Twitter({
    consumer_key: Config.TWITTER_CONSUMER_KEY,
    consumer_secret: Config.TWITTER_CONSUMER_SECRET,
    access_token_key: Config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: Config.TWITTER_ACCESS_TOKEN_SECRET
});
var feed;

function TwitterFeed(user, ch, discordie) {
    this.user = user;
    this.stream = client.stream('user', user);
    this.stream.on('data', ev = function(event) {
        console.log(event);
        console.log('\n\nscreen: ' + event.user.screen_name + "  user: " + user);
        if (event.user.screen_name == user) {
            discordie.Channels.get(ch).sendMessage("**New tweet from @" + user + "**\n" + event.text);
        }
    });

    this.stream.on('error', er = function(error) {
        console.log('error' + error);
    });

    TwitterFeed.prototype.endstream = function() {
        this.stream.removeListener('data', ev);
        this.stream.removeListener('error', er);
    }
}

exports.run = (e, params, discordie) => {
    //let settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'));

    switch (params[0]) {
        case 'watch':
            handlename = params[1];
            //if (!settings.hasOwnProperty("twitter")) settings.twitter = [];
            if (handlename.startsWith('@')) {
                handlename = handlename.split('')
                handlename.shift();
                handlename = handlename.join('');
            }

            if (feed) {
                feed.endstream();
                delete feed;
            }
            feed = new TwitterFeed(handlename, e.message.channel, discordie);
            e.message.channel.sendMessage("Watching tweets from **@" + handlename + "** user.");
            break;

        case 'stop':
            if (feed) {
                feed.endstream();
                delete feed;
                e.message.channel.sendMessage("Stopped watching tweets.");
            } else
                e.message.channel.sendMessage("No feeds found to stop.");
            break;

        default:
            var embed = {
                "color": 123134,
                "fields": [
                    { "name": "twitter watch ``<username>``", "value": "Watches and posts tweets from the mentioned twitter username" },
                    { "name": "twitter stop", "value": "Stops watching the twitter feed" }
                ]
            };
            e.message.channel.sendMessage(" ", false, embed);
    }

    //fs.writeFile("./settings.json", JSON.stringify(settings, null, 4), err => {
    //    if (err) console.log(err);
    //});
}