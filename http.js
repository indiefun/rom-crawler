const { writeFileSync, existsSync } = require('fs')

const agents = [
    'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
]

function randomAgent() {
    return agents[Math.floor(Math.random() * agents.length)]
}

async function download(url, path) {
    if (existsSync(path)) return
    console.log(`正在下载 ${url}...`)
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': randomAgent()
        }
    }
    const res = await fetch(url, options)
    const buffer = await res.arrayBuffer()
    writeFileSync(path, new Uint8Array(buffer))
}

async function json(url) {
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': randomAgent()
        }
    }
    const res = await fetch(url, options)
    return res.json()
}

module.exports = { download, json }
