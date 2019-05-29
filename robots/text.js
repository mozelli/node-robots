const algorithmia = require('algorithmia');
const credentials = require('../credentials/algorithmia.json');
const sentenceBoundaryDetection = require('sbd');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');

const nlu = new NaturalLanguageUnderstandingV1({
    iam_apikey: credentials.WATSON.apikey,
    version: '2018-04-05',
    url: credentials.WATSON.url
});

const state = require('./state.js');


async function robot() {

    const content = state.load();

    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
    limitMaximumSentences(content);
    await fetchKeywordsOfAllSentences(content);

    state.save(content);

    async function fetchContentFromWikipedia(content) {

        const algorithmiaAutenticated = algorithmia.client(credentials.API_KEY);

        const algorithmiaAlgorithm = algorithmiaAutenticated.algo(credentials.WIKIPEDIA.ALGO);

        const wikipediaResponse = await algorithmiaAlgorithm.pipe(content.input);

        const wikipediaContent = wikipediaResponse.get();

        content.searchContentOriginal = wikipediaContent.content;
    }

    function sanitizeContent(content) {
        
        const sanitized = removeBlankLinesAndMarkdown(content.searchContentOriginal);
        content.sourceContentSanitized = sanitized;

        function removeBlankLinesAndMarkdown(text) {
            const allLines = text.split('\n');

            const sanitizing = allLines.filter((lines) => {
                if(lines.trim().length === 0 || lines.trim().startsWith('=')) {
                    return false;
                }
                return true;
            })

            return sanitizing.join(' ').replace(/ /g, ' ' );
        }
    }

    function breakContentIntoSentences(content) {
        content.sentences = [];

        const sentences = sentenceBoundaryDetection.sentences(content.sourceContentSanitized);

        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        });
    }

    function limitMaximumSentences(content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences);
    }

    async function fetchKeywordsOfAllSentences(content) {
        for (const sentence of content.sentences) {
            sentence.keywords = await fetchWatsonReturnKeywords(sentence.text);
        }
    }

    async function fetchWatsonReturnKeywords(sentence) {
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: sentence,
                features: {
                    keywords: {}
                }
            },
                (error, response) => {
                    if (error) {
                        throw error;
                    }
                 const keywords = response.keywords.map((keyword) => {
                     return keyword.text
                 });
                 resolve(keywords)
            });
        });
    }
}

module.exports = robot;