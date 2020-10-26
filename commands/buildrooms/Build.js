const { MessageAttachment } = require('discord.js');
const { Command } = require('discord.js-commando');

module.exports = class Build extends Command {
    constructor(client) {
        super(client, {
            name: 'build',
            group: 'buildrooms',
            memberName: 'build',
            aliases: ['queue'],
            description: 'Submit an image to get feedback in a build room.'
        });
    }

    async run(msg, args) {
        let attachments = msg.attachments.array();

        // Prevent clutter and handle incorrect submissions
        if (attachments.length !== 1) msg.delete({ timeout: 30000 });
        if (attachments.length < 1) return (await msg.reply('please submit an image.')).delete({ timeout: 30000 });
        if (attachments.length > 1) return (await msg.reply('please only submit one image at a time.')).delete({ timeout: 30000 });

        let imgUrl = attachments[0].url;

        let rooms = msg.guild.settings.get('rooms', {});
        for (let room of Object.keys(rooms)) {
            if (rooms[room] === 'open') {
                let channel = msg.guild.channels.resolve(room);

                msg.guild.settings.set(`rooms.${room}`, 'busy');
                channel.send(`Designed by ${msg.author}.\nRemember to run "!m open" when you're finished.`, new MessageAttachment(imgUrl));
                return msg.delete({ timeout: 3000 });
            }
        }

        let queue = msg.guild.settings.get('queue', []);
        queue.push({
            imgUrl: imgUrl,
            msgUrl: msg.url,
            userId: msg.author.id
        });
        msg.guild.settings.set('queue', queue);
        return msg.reply(`your card has been added to the queue. There ${queue.length === 2 ? 'is' : 'are'} ${queue.length - 1} card${queue.length === 2 ? '' : 's'} in the queue before yours.`);
    }
};
