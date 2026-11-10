import { Bot , InlineKeyboard , session } from 'grammy';

const bot = new Bot ('ТУТ_ВАШ_ТОКЕН')

bot.use(session({
  initial : () => ({step : "none"})
}));

  bot.command("start", async (ctx) => { 
    ctx.session.step = "none"
    const keyboard = new InlineKeyboard ()
    .text("📋Моя карточка", "show_card")
    .text("📝Пройти опрос", "start_survey")
    await ctx.reply("Выберите действие :", {
     reply_markup : keyboard
   });
  });

bot.callbackQuery("show_card", async (ctx) => {
  if(!ctx.session.name){
    const noDate = new InlineKeyboard ()
    .text("📝Пройти опрос", "start_survey")
    await ctx.editMessageText("Пройдите опрос :", {
      reply_markup : noDate
    })
  } else {

   const text = `📋 **Твоя карточка:**\n\n👤 Имя: ${ctx.session.name}\n🎂 Возраст: ${ctx.session.age}\n🏰 Город: ${ctx.session.city}`;

   await ctx.editMessageText(text,{parse_mode : "Markdown" });
    
  }
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("start_survey", async ( ctx ) => {

ctx.session.step = "waiting_name"

await ctx.reply("Как тебя зовут?")

await ctx.answerCallbackQuery();
});

bot.on("message:text", async (ctx) => {

  if(ctx.session.step === "waiting_name"){

    ctx.session.name = ctx.message.text;

    ctx.session.step = "waiting_age";

  await ctx.reply(`Приятно познакомится, ${ctx.session.name}! Сколько тебе лет?`);
  }

  else if(ctx.session.step === "waiting_age"){

    ctx.session.age = ctx.message.text;

    ctx.session.step = "waiting_city"
  await ctx.reply(`Твой возраст, ${ctx.session.age}, сохранён. А теперь назови Город где ты живешь!`);
  }

  else if(ctx.session.step === "waiting_city"){

    ctx.session.city = ctx.message.text;

    ctx.session.step = "done"
    const showcard = new InlineKeyboard()
    .text("📋Моя карточка", "show_card")
    await ctx.reply(`Твой город, ${ctx.session.city}, сохранен! Теперь можешь посмотреть карточку : `, {
      reply_markup : showcard
    })
  }
});

bot.start()
