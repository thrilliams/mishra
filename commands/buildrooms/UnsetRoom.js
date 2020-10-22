const { Command } = require('discord.js-commando');

module.exports = class UnsetRoom extends Command {
    constructor(client) {
        super(client, {
            name: 'removeroom',
            group: 'buildrooms',
            memberName: 'remove',
            aliases: ['unsetroom', 'unregisterroom'],
            description: 'Sets a channel to no longer be used as a build room.',
            args: [{
                key: 'room',
                prompt: 'Which channel would you like to no longer be used as a build room?',
                type: 'channel'
            }],
            userPermissions: ['MANAGE_CHANNELS']
        });
    }

    async run(msg, args) {
        let rooms = msg.guild.settings.get('rooms', {});
        if (!args.room.id in rooms)
            return msg.channel.send(`${args.room} isn't a build room.`);

        msg.guild.settings.remove(`rooms.${args.room.id}`);
        return msg.channel.send(`${args.room} is no longer a build room.`);
    }
};
