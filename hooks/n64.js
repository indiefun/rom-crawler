const { existsSync, renameSync, mkdirSync } = require('node:fs')
const { tmpdir } = require('node:os')
const decompress = require('decompress')

const _tmpdir = `${tmpdir()}/roms/n64`
mkdirSync(_tmpdir, { recursive: true })

async function pre(game, base) {
    if (!existsSync(`${_tmpdir}/${game.title}.zip`)) return ;
    renameSync(`${_tmpdir}/${game.title}.zip`, `${base}/${game.title}.zip`)
}

async function post(game, base) {
    const info = {}
    if (!existsSync(`${base}/${game.title}.zip`)) return info
    const files = await decompress(`${base}/${game.title}.zip`, `${base}`)
    const roms = files.filter(({path}) => path.match(/\.z64|\.n64|\.v64$/))
    if (roms.length === 1) {
        const [rom] = roms
        info.path = `./${game.lang}/${game.name}/${rom.path}`
    } else {
        console.error(`no or more z64|n64|v64 files found: ${game.name}`)
    }
    renameSync(`${base}/${game.title}.zip`, `${_tmpdir}/${game.title}.zip`)
    return info
}

module.exports = { pre, post }
