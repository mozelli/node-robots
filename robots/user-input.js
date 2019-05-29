const readline = require('readline-sync');
const state = require('./state');

function robot(content) {
    content = 
    {
        "maximumSentences": 7,
        "input": {
            "lang": 'en'
        }
    };

    content.input.articleName = askAndReturnSearchTerm();
    content.prefix = askAndReturnPrefix();

    state.save(content);

    function askAndReturnSearchTerm() {
        return readline.question('Digite um termo para busca: ');
    }

    function askAndReturnPrefix() {
        const prefixes = ['Quem é ', 'O que é ', 'A história de '];
        const selectedPrefix = readline.keyInSelect(prefixes, "Escolha um tipo de pergunta: ");
        return prefixes[selectedPrefix];
    }
}

module.exports = robot;