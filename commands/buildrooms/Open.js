const { MessageAttachment } = require('discord.js');
const { resolveUrl } = require('../../api/resolveUrl.js');
const { Command } = require('discord.js-commando');

module.exports = class Open extends Command {
    constructor(client) {
        super(client, {
            name: 'open',
            group: 'buildrooms',
            memberName: 'open',
            description: 'Let Mishra know you\'re done with a build room.'
        });
    }

    async run(msg, args) {
        if (msg.guild.settings.get(`rooms.${msg.channel.id}`) !== 'busy') {
            let res = await msg.channel.send('This command must be run in an active build room.');
            msg.delete({ timeout: 30000 })
            return res.delete({ timeout: 30000 });
        }

        let queue = msg.guild.settings.get('queue', []);
        if (queue.length > 0) {
            let next = queue.splice(0, 1)[0];
            msg.guild.settings.set('queue', queue);

            msg.guild.settings.set(`rooms.${msg.channel.id}`, 'busy');
            let original = resolveUrl(this.client, next.msgUrl);
            if (original) original.delete();
            msg.channel.send(`Designed by <@${next.userId}>.\nRemember to run "!m open" when you're finished.`, new MessageAttachment(next.imgUrl));
        } else {
            msg.guild.settings.set(`rooms.${msg.channel.id}`, 'open');
            return msg.channel.send(`${msg.channel} is now open.`);
        }
    }
};
