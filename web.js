const { mkdirSync, writeFileSync, existsSync, renameSync, rmSync } = require('fs')
const { download } = require('./http')
const { webpToJpeg } = require('./image')
const { timeout, groupByLanguage, groupByTitle } = require('./utils')
const { prompt } = require('./input')
const xml = require('./xml')

async function _fetchGames(games, options = {}) {
    const type = options?.type ?? 'nes'
    const list = []
    for (const game of games) {
        console.log(`${game.name}:`)
        const root = `./${type}/${game.lang}/${game.name}`
        mkdirSync(root, { recursive: true })
        await download(`https://binary.zaixianwan.app/${game.binary}`, `${root}/${game.title}.zip`)
        const info = { path: `./${game.lang}/${game.name}/${game.title}.zip`, name: game.name, lang: game.lang }
        if (game.titleScreenImage) {
            if (!existsSync(`${root}/${game.title}.jpg`)) {
                await download(`https://images.zaixianwan.app/${game.titleScreenImage}`, `${root}/${game.title}.webp`)
                await webpToJpeg(`${root}/${game.title}.webp`)
                rmSync(`${root}/${game.title}.webp`)
            }
            info.image = `./${game.lang}/${game.name}/${game.title}.jpg`
        }
        list.push(xml.game(info))
    }

    const infos = xml.temp(list)
    writeFileSync(`./${type}/gamelist.xml`, infos)
}

async function fetchGames(games, options = {}) {
    try {
        await _fetchGames(games, options)
    } catch (e) {
        console.error(e)
        await timeout(10000)
        await fetchGames(games, options)
    }
}

async function filterGames(infos, options) {
    const langs = groupByLanguage(infos)
    for (const lang of Object.keys(langs)) {
        mkdirSync(`./${options.type}/${lang}`, { recursive: true })
    }

    console.log(`一共存在 ${Object.keys(langs).length} 种语言, 数量如下:`)
    console.log(Object.entries(langs).map(([l, a]) => `	${l}: ${a.length}`).join('\n'))
    if (!options.filter.lang) options.filter.lang = await prompt(`请输入要下载的语言, 例如 'zh', 留空则下载全部语言: `)

    const games = []
    const rests = []
    for (const [lang, list] of Object.entries(langs)) {
        if (options.filter.lang && options.filter.lang === lang) games.push(...list)
        else rests.push(...list)
    }

    const names = groupByTitle(games)

    // choose when multiple
    const array = []
    for (const [name, list] of Object.entries(names)) {
        let choice = 0
        if (list.length > 1) {
            console.error(`${name} 存在 ${list.length} 个信息: \n${list.map((game, i) => `${i + 1}. ${game.title}`).join('\n')}`)
            choice = (await prompt(`请输入要保留的序号, 留空则保留第一个: `, 1)) - 1
        }
        array.push(list[choice])
    }

    // save choose
    if ((array.length + rests.length) !== infos.length) {
        const sure = await prompt(`是否将结果存入${options.type}.json文件? [y/n] `)
        if (sure === 'y') {
            renameSync(`./${options.type}.json`, `./${options.type}.json.bak`)
            writeFileSync(`./${options.type}.json`, JSON.stringify([...array, ...rests]))
        }
    }

    return array
}

module.exports = { fetchGames, filterGames }
