const { Command } = require('discord.js-commando');
const { homepage } = require('../../package.json');

module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'source',
            group: 'util',
            memberName: 'source',
            aliases: ['sourcecode', 'gh', 'github'],
            description: 'See what makes Mishra tick.'
        });
    }

    async run(msg, args) {
        msg.channel.send(homepage);
    }
};
