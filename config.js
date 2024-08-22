const n64 = require('./hooks/n64')

module.exports = {
    types: {
        nes: '       红白机（FC / NES）', 
        snes: '      超级任天堂（SFC / SNES）', 
        n64: '       任天堂64（N64）', 
        ps: '          未测试 PlayStation（PS）', 
        ps2: '         未测试 PlayStation 2', 
        gb: '        Game Boy（GB）', 
        gbc: '       Game Boy Color（GBC）', 
        gba: '       Game Boy Advance（GBA）', 
        nds: '         未测试 任天堂DS（NDS）', 
        segaMD: '    Sega Mega Drive', 
        segaSaturn: '  未测试 世嘉土星（Sega Saturn）', 
        ngpc: '        未测试 Neo Geo Pocket Color', 
        ngp: '         未测试 Neo Geo Pocket', 
        atari2600: '   未测试 Atari 2600', 
        atari5200: '   未测试 Atari 5200', 
        atari7800: '   未测试 Atari 7800', 
        lynx: '        未测试 Atari Lynx', 
        ws: '          未测试 Wanderswan', 
        wsc: '         未测试 Wanderswan Color', 
        vb: '          未测试 Virtual Boy', 
        segaGG: '      未测试 Sega Game Gear', 
        jaguar: '      未测试 Atari Jaguar', 
        pce: '         未测试 TurboGrafx-16 | PC Engine'
    },
    pres: {
        n64: n64.pre
    },
    posts: {
        n64: n64.post,
    }
}
