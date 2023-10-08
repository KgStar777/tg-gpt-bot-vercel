import { Telegraf, session } from 'telegraf';
import { message } from 'telegraf/filters';

import { about } from './commands';
import { greeting, question } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const OPENAI_KEY = process.env.OPENAI_KEY || '';

/** В итоге: чат с gpt-ботом, где для каждого участника,
 *           обратившемуся к боту открывается собственная сессия и 
 *           закрывается по истечении 10 минут неактивности в tg,
 *           если таковую можно мониторить */   

// Определяем список команд
const commands = [
  { command: 'start', description: 'Начать' },
  { command: 'help', description: 'Помощь' },
  // Добавляем другие команды здесь
];

const INITIAL_SESSION = {
  messages: [],
}

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
// Установливаем список команд
bot.telegram.setMyCommands(commands);

// bot.use(session());

// Обработка команды /start
bot.start((ctx) => {
  ctx.reply('Привет! Я твой бот. Спрашивай что хочешь. Жду...');
});

// Обработка команды /help
bot.help((ctx) => {
  const commandList = commands.map((cmd) => `/${cmd.command} - ${cmd.description}`).join('\n');
  ctx.reply(`Список доступных команд:\n${commandList}`);
});

bot.command('about', about());
// bot.on('message', greeting());
// bot.on('message', question());
bot.on(message('text'), question());

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
