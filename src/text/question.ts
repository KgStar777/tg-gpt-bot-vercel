import { Context } from 'telegraf';
import createDebug from 'debug';
import { message } from 'telegraf/filters';
import { Chat, Message } from 'telegraf/typings/core/types/typegram';
import { SessionContext } from 'telegraf/typings/session';

const INITIAL_SESSION = {
  messages: [],
}

const debug = createDebug('bot:greeting_text');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_to_message_id: messageId,
  });

const question = () => async (ctx: Context) => {
  debug('Triggered "greeting" text command');

//   console.log("ctx: ", ctx?.message?.text);

    const chatType = (ctx.chat as Chat).type;
    // ctx.session ??= INITIAL_SESSION;

  const messageId = ctx.message?.message_id;
  const userName = `${ctx.message?.from.first_name} ${ctx.message?.from.last_name}`;
  const messageText = (ctx.message as Message.TextMessage)?.text;

  if (messageId) {
    await replyToMessage(ctx, messageId, `I need time to think`);
  }


};

export { question };
