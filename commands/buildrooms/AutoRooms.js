const { Command } = require('discord.js-commando');

module.exports = class AutoRooms extends Command {
    constructor(client) {
        super(client, {
            name: 'autorooms',
            group: 'buildrooms',
            memberName: 'auto',
            aliases: ['detectrooms'],
            description: 'Automatically adds all rooms whose names follow the pattern "#build-room-N" or a regex pattern.',
            userPermissions: ['MANAGE_CHANNELS'],
            args: [{
                key: 'pattern',
                label: '(optional) A regex pattern to filter channel names. Case sensitive.',
                prompt: 'Please specify a pattern to filter channel names.',
                default: new RegExp('build-room-[0-9]{1,}'),
                validate: val => {
                    try {
                        new RegExp(val)
                    } catch (e) {
                        return e;
                    }
                    return true;
                },
                parse: val => new RegExp(val)
            }]
        });
    }

    async run(msg, args) {
        let channels = msg.guild.channels.cache;
        channels = channels.filter(c => args.pattern.test(c.name));

        let oldchannels = msg.guild.settings.get('rooms', {});
        channels = channels.filter(c => !(c.id in oldchannels)).array();
        if (channels.length === 0)
            return msg.channel.send('No new build rooms were added.');

        for (let channel of channels)
            msg.guild.settings.set(`rooms.${channel.id}`, 'open');

        channels = channels.map((e, i) => `${i !== 0 && i === channels.length - 1 ? 'and ' : ''}${msg.guild.channels.resolve(e)}`).join(', ');
        return msg.channel.send(`${channels} are now build rooms.`);
    }
};
