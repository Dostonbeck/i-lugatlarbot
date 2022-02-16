const {Scenes, Composer} = require('telegraf')
const User = require('../modal/User')
const axios = require('axios')
const menu = require('../messages')
const started = new Composer()

started.start(async (ctx)=>{
    ctx.replyWithHTML(menu[0].greeting)
    let user__name = (ctx.from?.first_name)?((ctx.from.last_name)?ctx.from.first_name+" "+ctx.from.last_name:ctx.from.first_name):(ctx.from.last_name)
    let nick__name = (ctx.from?.username)?(ctx.from.username):(menu[0].notFoundUsername)
    let addUser = {
        name: user__name,
        tg_id: parseInt(ctx.from.id),
        ban: false,
        status: menu[0].positionNewUser,
        username: nick__name
    }

// base check user id
    const checkId = await User.findOne({tg_id: addUser.tg_id})
    if(!checkId) {
        User.create(addUser)
        let msg =`
${menu[0].allUsers}: ${await User.count()}
${menu[0].newUser}:  <a href="tg://user?id=${addUser.tg_id}">${addUser.name}</a>
`
        await ctx.telegram.sendMessage(process.env.CHANNEL_ID, msg, {
            parse_mode: "HTML"
        })
    } else {
        // ban:  for true value
    }
    
})

started.hears(/[a-z]/, (ctx)=>{
   let word = encodeURI(ctx.match['input']) 
    let rest = axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(res => getData(res, ctx))
    .catch(err => notFound(err, ctx, word))

})

async function getData(res, ctx){
    let matn =`

${menu[0].wordSearch}: ${res.data[0].word} 
${menu[0].transcrption}: [${res.data[0].phonetics[0].text}]
${menu[0].partOfSpeech}: ${res.data[0].meanings[0].partOfSpeech}
${menu[0].synonyms}: ${((res.data[0].meanings[0].definitions[0].synonyms).length===0)?"Sinonimi yo'q": (res.data[0].meanings[0].definitions[0].synonyms).map(item => {return ` ${item}`})}
${menu[0].antonyms}: ${((res.data[0].meanings[0].definitions[0].antonyms).length===0)?"Antonimi yo'q": (res.data[0].meanings[0].definitions[0].antonyms).map(item => {return ` ${item}`})}
${menu[0].example}: ${res.data[0].meanings[0].definitions[0].example}.

${menu[0].adversiment}`
    await ctx.replyWithHTML(matn)
    await ctx.replyWithVoice({
        url: `https:${res.data[0].phonetics[0].audio}`,
        filename: `${res.data[0].word}.ogg`
    })
}

async function notFound(err, ctx, word){
    ctx.reply(decodeURI(word)+menu[0].notFoundAndExampleSearch)
}

const startes = new Scenes.WizardScene('startScene', started)
module.exports = startes