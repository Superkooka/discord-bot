const { prefix } = require('../../config.json');

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
    }
    client.on('message', message => {
        const { content } = message;

        aliases.forEach(alias => {
            const command = `${prefix}${alias}`;
            const args = message.content.trim().split(/ +/g);

            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running ${command} in #${message.channel.name}`);
                callback(message, args);
            }
        })
    })
}
