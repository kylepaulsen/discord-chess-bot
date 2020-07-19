import dotenv from 'dotenv';
import chessState from './chessBoard.js';

import { parseChessMove, parseChessCoord } from './util.js';
import { pieces } from './images.js';

dotenv.config();

const commandPrefix = process.env.CMD_PREFIX || '!';
const piecesWithNone = pieces.concat('none');

const commands = {
    new: message => {
        chessState.newBoard();
        chessState.sendBoardImage(message, 'New Game');
        chessState.saveBoard();
    },
    move: async message => {
        const msgNoPrefix = message.content.replace(commandPrefix, '');
        const chessMove = parseChessMove(msgNoPrefix);
        const { board } = chessState;
        if (!chessMove) {
            message.channel.send(`Invalid chess move. Try typing something like: \`${commandPrefix}d2 d4\`` +
                `or \`${commandPrefix}b1 to c3\`. You can also start a new game with \`${commandPrefix}new\``);
        } else if (board[chessMove.from.y][chessMove.from.x]) {
            const targetPiece = board[chessMove.from.y][chessMove.from.x];
            board[chessMove.to.y][chessMove.to.x] = targetPiece;
            board[chessMove.from.y][chessMove.from.x] = undefined;

            await chessState.sendBoardImage(message, msgNoPrefix);
            chessState.saveBoard();

            if ((chessMove.to.y === 0 || chessMove.to.y === 7) && targetPiece.includes('pawn')) {
                message.channel.send(`You can change a piece type with a command like: ` +
                    `\`${commandPrefix}set b8 wqueen\`. The valid piece names are: ` +
                    `\`${piecesWithNone.join(', ')}\``);
            }
        } else {
            message.channel.send('No piece found at that location.');
        }
    },
    set: (message, msgParts) => {
        if (msgParts.length === 3) {
            const coord = parseChessCoord(msgParts[1]);
            if (coord && piecesWithNone.includes(msgParts[2])) {
                const target = msgParts[2] === 'none' ? undefined : msgParts[2];
                chessState.board[coord.y][coord.x] = target;
                chessState.sendBoardImage(message, `set ${msgParts[1]} to ${msgParts[2]}`);
                chessState.saveBoard();
                return;
            }
        }
        message.channel.send(`Invalid set command. The set command looks like: \`${commandPrefix}set b8 wqueen\`` +
            `. The valid piece names are: \`${piecesWithNone.join(', ')}\``);
    }
};

export default commands;
