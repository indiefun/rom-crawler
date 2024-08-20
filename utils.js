async function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function normalizeName(info) {
    return info.title.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim()
}

function groupByField(infos, field) {
    const groups = {}
    for (const info of infos) {
        const key = info[field]
        let group = groups[key]
        if (!group) {
            group = []
            groups[key] = group
        }
        group.push(info)
    }
    return groups
}

function groupByLanguage(infos) {
    // zh-Hans -> zh
    // zh-Hant -> zh
    for (const info of infos) {
        let lang = info.language
        if (lang === 'zh-Hans') lang = 'zh'
        if (lang === 'zh-Hant') lang = 'zh'
        info.lang = lang
    }
    return groupByField(infos, 'lang')
}

function groupByTitle(infos) {
    for (const info of infos) {
        info.name = normalizeName(info)
    }
    return groupByField(infos, 'name')
}

module.exports = { timeout, normalizeName, groupByField, groupByLanguage, groupByTitle }
