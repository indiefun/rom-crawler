const n64 = require('./hooks/n64')

module.exports = {
    types: {
        nes: '红白机（FC / NES）', 
        snes: '超级任天堂（SFC / SNES）', 
        n64: '任天堂64（N64）', 
        ps: 'PlayStation（PS）', 
        ps2: 'PlayStation 2', 
        gb: 'Game Boy（GB）', 
        gbc: 'Game Boy Color（GBC）', 
        gba: 'Game Boy Advance（GBA）', 
        nds: '任天堂DS（NDS）', 
        segaMD: 'Sega Mega Drive', 
        segaSaturn: '世嘉土星（Sega Saturn）', 
        ngpc: 'Neo Geo Pocket Color', 
        ngp: 'Neo Geo Pocket', 
        atari2600: 'Atari 2600', 
        atari5200: 'Atari 5200', 
        atari7800: 'Atari 7800', 
        lynx: 'Atari Lynx', 
        ws: 'Wanderswan', 
        wsc: 'Wanderswan Color', 
        vb: 'Virtual Boy', 
        segaGG: 'Sega Game Gear', 
        jaguar: 'Atari Jaguar', 
        pce: 'TurboGrafx-16 | PC Engine'
    },
    pres: {
        n64: n64.pre
    },
    posts: {
        n64: n64.post,
    }
}
