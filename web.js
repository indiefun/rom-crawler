const { mkdirSync, writeFileSync, existsSync, renameSync, rmSync } = require('fs')
const { download, json } = require('./http')
const { webpToJpeg } = require('./image')
const { timeout, groupByLanguage, groupByTitle } = require('./utils')
const { prompt } = require('./input')
const { getCache, setCache } = require('./cache')
const { types, pres, posts } = require('./config')
const xml = require('./xml')

async function _fetchGames(games, options = {}) {
    const root = `./${options?.type ?? '.'}`
    const list = []
    for (const game of games) {
        console.log(`${game.name}:`)
        
        const base = `${root}/${game.lang}/${game.name}`
        mkdirSync(base, { recursive: true })

        const pre = pres[options.type]
        if (pre) await pre(game, base)
        
        await download(`https://binary.zaixianwan.app/${game.binary}`, `${base}/${game.title}.zip`)
        
        const info = { path: `./${game.lang}/${game.name}/${game.title}.zip`, name: game.name, lang: game.lang }
        if (game.titleScreenImage) {
            if (!existsSync(`${base}/${game.title}.jpg`)) {
                await download(`https://images.zaixianwan.app/${game.titleScreenImage}`, `${base}/${game.title}.webp`)
                await webpToJpeg(`${base}/${game.title}.webp`)
                rmSync(`${base}/${game.title}.webp`)
            }
            info.image = `./${game.lang}/${game.name}/${game.title}.jpg`
        }
        
        const post = posts[options.type]
        if (post) Object.assign(info, await post(game, base))

        list.push(xml.game(info))
    }

    const infos = xml.temp(list)
    writeFileSync(`${root}/gamelist.xml`, infos)
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

async function fetchList(options) {
    console.log(`可下载的游戏类型：\n${Object.entries(types).map(([k, v]) => `  ${k}: ${v}`).join('\n')}`)
    options.type = options?.type ?? await prompt('请输入要下载的游戏类型: ')
    return await json(`https://api.zaixianwan.app/v1/games?type=${options.type}`)
}

async function filterGames(infos, options) {
    const langs = groupByLanguage(infos)
    for (const lang of Object.keys(langs)) {
        mkdirSync(`./${options.type}/${lang}`, { recursive: true })
    }

    console.log(`一共存在 ${Object.keys(langs).length} 种语言, 数量如下:`)
    console.log(Object.entries(langs).map(([l, a]) => `  ${l}: ${a.length}`).join('\n'))
    if (!options.filter.lang) options.filter.lang = await prompt(`请输入要下载的语言, 例如 'zh', 留空则下载全部语言: `)

    const cache = getCache()
    const kicks = cache.kicks ?? []
    const games = (options.filter.lang ? langs[options.filter.lang] : infos).filter(game => !kicks.includes(game.title))
    const names = groupByTitle(games)

    // choose when multiple
    const saves = []
    for (const [name, list] of Object.entries(names)) {
        let choice = 0
        if (list.length > 1) {
            console.log(`${name} 存在 ${list.length} 个信息: \n${list.map((game, i) => `${i + 1}. ${game.title}`).join('\n')}`)
            choice = (await prompt(`请输入要保留的序号, 留空则保留第一个: `, 1)) - 1
        }
        saves.push(list[choice])
        kicks.push(...(list.filter((_, i) => i !== choice).map(game => game.title)))
    }

    // save kicks in cache
    cache.kicks = kicks
    setCache(cache)

    return saves
}

module.exports = { fetchList, fetchGames, filterGames }
