import dotenv from 'dotenv';
import Discord from 'discord.js';

import chessState from './chessBoard.js';
import { loadImages } from './images.js';
import commands from './commands.js';

dotenv.config();

const client = new Discord.Client();

const commandPrefix = process.env.CMD_PREFIX || '!';
const requiredChannel = process.env.BOT_CHANNEL || 'chess';
const DEV_MODE = process.env.DEV_MODE || false;

client.on('ready', () => {
    console.log('ChessBot Running!');
});

client.on('message', async message => {
    const msg = message.content.trim();
    const isDm = message.channel.type === 'dm';
    const inRequiredChannel = message.channel.name === requiredChannel;
    if (!message.author.bot && (inRequiredChannel || (DEV_MODE && isDm))) {
        if (!chessState.board && msg !== `${commandPrefix}new`) {
            message.channel.send(`Type \`${commandPrefix}new\` to start a new game. ` +
                `Then type something like: \`${commandPrefix}b2 b3\` to perform a move.`);
            return;
        }
        const msgParts = msg.split(/\s+/);
        const commandName = msgParts[0].replace('!', '');
        if (msg.startsWith(commandPrefix)) {
            const command = commands[commandName] || commands.move;
            if (command) {
                command(message, msgParts);
            }
        }
    }
});

const init = async () => {
    await Promise.all([loadImages(), chessState.loadBoard()]);
    client.login(process.env.DISCORD_BOT_TOKEN);
};

init();
