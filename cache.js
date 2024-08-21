const { existsSync, readFileSync, writeFileSync } = require('fs')

function getCache() {
    if (!existsSync('./cache.json')) return {}
    return JSON.parse(readFileSync('./cache.json'))
}

function setCache(cache) {
    writeFileSync('./cache.json', JSON.stringify(cache))
}

module.exports = { getCache, setCache }
