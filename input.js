const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

async function prompt(question = '> ', defaultAnswer = undefined) {
    const rl = readline.createInterface({ input, output })
    const answer = await rl.question(question)
    rl.close()
    return answer && answer.length > 0 ? answer : defaultAnswer
}

module.exports = { prompt }
