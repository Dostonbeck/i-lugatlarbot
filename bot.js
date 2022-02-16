require('dotenv').config()
const { Telegraf }= require('telegraf')
const {scenesSetup} = require('./middleware')
const connect = require('./core/db')
const menu = require('./messages')
const bot = new Telegraf(process.env.TOKEN) 

// Middleware setup
scenesSetup(bot)

// Database check connect
connect()

// start command click
bot.start(ctx =>{
    ctx.scene.enter('startScene')
})

bot.catch((err, ctx)=>{
    ctx.telegram.sendMessage(process.env.CHANNEL_ID, `${menu[0].errorBot}  ${err}`)
})



// Run bot with polling
bot.launch()
