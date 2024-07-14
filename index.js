const TelegramBot = require('node-telegram-bot-api');
const express = require('express')
const cors = require('cors')

const token = '6631355009:AAGxyxPIV_a701-kJSZngcOQvkNmJajZd0g'
const bot = new TelegramBot(token, {polling: true});
const web_app_url = 'https://tg-web-app-react-jade.vercel.app/'

const app = express()

app.use(express.json())
app.use(cors())
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text

    if(text === '/start'){
        await bot.sendMessage(chatId,'Ниже появится кнопка заполните форму',{
            reply_markup:{
                keyboard:[
                    [{text:'Салам заполни форму братишка',web_app:{url:web_app_url + '/form'}}]
                ],
            }
        })
        await bot.sendMessage(chatId,'Заходи в наш интернет магазин по кнопке ниже',{
            reply_markup:{
                inline_keyboard:[
                    [{text:'Сделать заказ',web_app:{url:web_app_url}}]
                ],
            }
        })
    }
    if(msg?.web_app_data?.data){
        try{
            console.log(msg?.web_app_data?.data)
            const data = JSON.parse(msg?.web_app_data?.data)
            await bot.sendMessage(chatId,'Спасибо за обратную связь!')
            await bot.sendMessage(chatId,'Ваша страна: ' + data.country)
            await bot.sendMessage(chatId,'Ваша улица: ' + data.street)

            setTimeout(async ()=>{
                await bot.sendMessage(chatId,'Всю информацию получите в этом чате')
            },3000)

        }catch (e) {
            console.log(e)
        }
    }
});

app.post('/web-data',async (req,res)=>{
    const {queryId,products,totalPrice} = req.body

    try{
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Успешная покупка',
            input_message_content: {message_text: 'Поздравляю с покупкой, вы приобрели товар на сумму '+totalPrice}
        })
        return res.status(200).json({})
    }catch (e) {
        await bot.answerWebAppQuery(queryId,{
            type:'article',
            id:queryId,
            title:'Не удалось приобрести товар',
            input_message_content: {message_text: 'Не удалось приобрести товар'+totalPrice}
        })
        return res.status(500).json({})
    }
})

const PORT = 8000

app.listen(PORT,()=>{
    console.log(`Server started on port ` + PORT)
})

