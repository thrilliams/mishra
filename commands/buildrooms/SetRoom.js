const { Command } = require('discord.js-commando');

module.exports = class SetRoom extends Command {
    constructor(client) {
        super(client, {
            name: 'setroom',
            group: 'buildrooms',
            memberName: 'set',
            aliases: ['registerroom'],
            description: 'Sets a channel to be used as a build room.',
            args: [{
                key: 'room',
                prompt: 'Which channel would you like to set as a build room?',
                type: 'channel'
            }],
            userPermissions: ['MANAGE_CHANNELS']
        });
    }

    async run(msg, args) {
        let rooms = msg.guild.settings.get('rooms', {});
        if (args.room.id in rooms)
            return msg.channel.send(`${args.room} is already a build room.`);

        msg.guild.settings.set(`rooms.${args.room.id}`, 'open');
        return msg.channel.send(`${args.room} is now a build room.`);
    }
};
