const request = require('request');
const Discordie = require('discordie');
const fs = require('fs');

const Config = require('./config.json');
const Setter = require("./modules/setter.js");

const Events = Discordie.Events;
const discordie = new Discordie({ autoReconnect: true });

let prefix = Config.DEFAULT_PREFIX;
let settings = JSON.parse(fs.readFileSync('./settings.json'));


discordie.connect({
    token: Config.ALPHA_BOT_TOKEN, //Paste your Bot Application Token here instead of Key.getBotToken()
});

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log("connected as " + discordie.User.username);
    var game = { type: 0, name: prefix + "help", url: "https://goo.gl/ezgx4t" };
    discordie.User.setGame(null, game);

});

//New member joined the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
    //e.message.channel.sendMessage('Welcome!');
    Setter.welcome(e, discordie, settings);
});

//member left the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
    //e.message.channel.sendMessage('A User has left this channel.');
    let settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));
    Setter.goodbye(e, discordie, settings);
});

discordie.Dispatcher.on(Events.MESSAGE_DELETE, e => {
    //embed(e, e.message.content, "delete");
    let settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));
    Setter.deletelog(e, discordie, settings)
});

discordie.Dispatcher.on(Events.MESSAGE_REACTION_ADD, e => {
    let settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));
    Setter.starboard(e, discordie, settings);
});

//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    //console.log(e.message.author.username);  
    if (e.message.author.bot || e.message.author.id === discordie.User.id) {
        // Ignore
    } else {
        if (e.message.isPrivate) {
            e.message.reply('This bot cannot be used in direct messages. Please invite me to a server and try again!');
        } else {

            if (!e.message.content.startsWith(prefix)) return;

            const params = e.message.content.split(/\n|\s/).slice(1); //split at space and new line
            var cmd = e.message.content.split(' ')[0].split("");
            cmd.shift();
            cmd = cmd.join("");
           // console.log(params);
            try {
                let commandFile = require('./commands/' + cmd + '.js');
                commandFile.run(e, params, discordie);
            } catch (err) {
                if (!err.message.startsWith("Cannot find module")) {
                    e.message.channel.sendMessage("```" + err.message + "```");
                    console.log(err);
                }
            }
            //console.log(params);
        }
    }
});