import 'source-map-support/register';
import fs from 'fs';
import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';

const API_TOKEN = fs.readFileSync('./token.txt').toString();
const bot: Telegraf<Context<Update>> = new Telegraf(API_TOKEN);

bot.start(context => {
    context.reply('Hello. My name is Alex Sharp.');
});

bot.on('text', context => {
    const incomingMessage = context.message.text;
});