const {Scenes, Composer} = require('telegraf')

const started = new Composer()

started.on('text',(ctx)=>{
    ctx.reply("Hello dictionary")
})

const dictionary = new Scenes.WizardScene('dicScene', started)

module.exports = dictionary;