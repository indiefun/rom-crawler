const { fetchList, fetchGames, filterGames } = require('./web')

async function main(...args) {
    const options = {
        type: args.shift(),
        filter: { lang: args.shift() },
    }
    const infos = await fetchList(options)
    const array = await filterGames(infos, options)
    await fetchGames(array, options)
}

main(...process.argv.slice(2)).then()
