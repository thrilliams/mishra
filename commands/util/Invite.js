const { Command } = require('discord.js-commando');

module.exports = class Invite extends Command {
    constructor(client) {
        super(client, {
            name: 'invite',
            group: 'util',
            memberName: 'invite',
            description: 'Bring Mishra to a new plane!'
        });
    }

    async run(msg, args) {
        msg.channel.send(`https://discord.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8`);
    }
};
