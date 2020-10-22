const { Client } = require('discord.js-commando');
const LowDBProvider = require('./api/LowDBProvider.js');
const path = require('path');
const secret = require('./secret.json');

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
    .on('rateLimit', console.log);

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