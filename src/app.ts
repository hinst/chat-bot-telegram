import 'source-map-support/register';
import fs from 'fs';
import log4js from 'log4js';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';
import MessageGenerator from './MessageGenerator';
import { MESSAGES } from './data/topWords';
import { CUSTOM_TOP_WORDS } from './customTopWords';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        files: { type: 'dateFile', filename: 'log.txt', alwaysIncludePattern: true, keepFileExt: true, numBackups: 10 }
    },
    categories: {
        default: { appenders: [ 'console', 'files' ], level: 'debug' }
    }
});

const logger = log4js.getLogger('app');
logger.info('Starting...');

const apiToken = fs.readFileSync('./token.txt').toString();
const bot: Telegraf<Context<Update>> = new Telegraf(apiToken);
const allowedUserIds: number[] = JSON.parse(fs.readFileSync('./allowed-user-ids.json').toString());
if (!allowedUserIds.length)
logger.warn("There are no allowed user ids");

bot.start(context => {
    context.reply('Hello. ' + 'Type ! to get a random sentence.');
});

bot.on('text', context => {
    const senderId = context.message?.from?.id;
    if (allowedUserIds.includes(senderId)) {
        const incomingMessage = context.message.text;
        const generator = new MessageGenerator(CUSTOM_TOP_WORDS, MESSAGES);
        const responseText = generator.generateResponse(incomingMessage);
        context.reply(responseText, { parse_mode: 'Markdown' });
    } else {
        context.reply("Error: you are not authorized to use this bot. Your id is " + senderId + ". " +
        "Please ask the owner of the bot to add you to the list of authorized users.");
    }
});

bot.launch();
logger.info('Started.');