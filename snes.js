const { fetchGames, filterGames } = require('./web')

async function main(...args) {
    const options = {
        type: 'snes',
        filter: { lang: args.shift() },
    }
    const infos = require(`./${options.type}.json`)
    const array = await filterGames(infos, options)
    await fetchGames(array, options)
}

main(...process.argv.slice(2)).then()
