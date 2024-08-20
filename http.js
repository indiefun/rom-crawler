const { writeFileSync, existsSync } = require('fs')

async function download(url, path) {
    if (existsSync(path)) return
    console.log(`正在下载 ${url}...`)
    const options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        }
    }
    const res = await fetch(url, options)
    const buffer = await res.arrayBuffer()
    writeFileSync(path, new Uint8Array(buffer))
}

module.exports = { download }
