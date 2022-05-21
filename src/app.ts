import 'source-map-support/register';
import fs from 'fs';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';

const apiToken = fs.readFileSync('./token.txt').toString();
const bot: Telegraf<Context<Update>> = new Telegraf(apiToken);
const allowedUserIds: number[] = JSON.parse(fs.readFileSync('./allowed-user-ids.json').toString());
if (!allowedUserIds.length)
    console.warn("There are no allowed user ids");

bot.start(context => {
    context.reply('Hello. My name is Alex Sharp.');
});

bot.on('text', context => {
    const senderId = context.message?.from?.id;
    if (allowedUserIds.includes(senderId)) {
        const incomingMessage = context.message.text;
        context.reply("Your message was: " + incomingMessage);
    } else {
        context.reply("Error: you are not authorized to use this bot. Your id is " + senderId);
    }
});

bot.launch();