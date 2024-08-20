const sharp = require('sharp');
const { writeFileSync, readFileSync, existsSync } = require('fs')

async function webpToJpeg(path) {
    const _path = path.replace(/\.webp$/, '.jpg')
    if (existsSync(_path)) return
    const buffer = readFileSync(path)
    const data = await sharp(buffer).jpeg().toBuffer()
    writeFileSync(_path, data)
}

module.exports = { webpToJpeg }
