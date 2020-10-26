const { Client } = require('discord.js-commando');
const secret = require('./secret.json');

const LowDBProvider = require('./api/LowDBProvider.js');
const path = require('path');

const brackets = require('g2-bracket-parser');
const parser = require('fast-xml-parser');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { parseMana, parseText } = require('./api/utilities.js');

const xmlUrl = 'https://cdn.discordapp.com/attachments/706352828398043146/768586146296758292/CDH.Upload.14.5_Ihsan_X_cant_be_Zero.xml'; // TODO: Find a way to automate this so I don't need to update the source code every time trix updates the xml

const client = new Client({
    owner: '294625075934527495', // thrilliams#5489, change if you want
    commandPrefix: '!m'
});

client
    .on('ready', () => {
        console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
        client.user.setPresence({
            activity: {
                name: '!m help',
                type: 'WATCHING'
            }
        });
    })
    .on('rateLimit', console.log)
    .on('message', async msg => {
        if (msg.author.bot) return;

        let names = brackets(msg.content, {
            brackets: {
                '<<': { start: '<<', end: '>>', length: 2 }
            }
        }).map(e => e.match.content);
        if (names.length <= 0) return;

        let xmlData = await fetch(xmlUrl);
        xmlData = await xmlData.text();
        if (parser.validate(xmlData) !== true) return;
        let cards = parser.parse(xmlData, { ignoreAttributes: false, attributeNamePrefix: '' }).cockatrice_carddatabase.cards.card; // this looks dumb but it works i promise

        names.forEach(name => {
            let realname = name;
            name = name.toLowerCase().replace(/[!\?,;:\-—\(\)\/"'“”‘’&\. ]/g, '');

            let matches = [];
            for (let card of cards) {
                let cardname = card.name.toLowerCase().replace(/[!\?,;:\-—\(\)\/"'“”‘’&\. ]/g, '');
                if (cardname.includes(name)) matches.push(card);
            }

            let embed = new MessageEmbed();
            if (matches.length === 0) {
                embed.setDescription(`No card found for “${realname}”`);
            } else if (matches.length > 1) {
                embed.setDescription(`Multiple cards match “${realname}”, can you be more specific?`);
            } else {
                let card = matches[0];

                embed.setTitle(`${card.name}${card.cost ? ' ' + parseMana(client, card.prop.manacost) : ''}`);
                embed.setThumbnail(card.set.picurl);
                embed.setDescription(`${card.prop.type}\n${parseText(client, card.text)}${card.prop.pt ? '\n' + card.prop.pt : ''}`);
            }
            return msg.channel.send(embed);
        });
    });

client.setProvider(new LowDBProvider(path.join(process.env.PWD, 'db.json'))).catch(console.error);

client.registry
    .registerGroups([
        ['buildrooms', 'Build rooms'],
        ['util', 'Utility']
    ])
    .registerDefaultTypes()
    .registerDefaultGroups()
    .registerDefaultCommands({ help: false })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(secret.client_tokens[secret.production ? 'production' : 'development']);