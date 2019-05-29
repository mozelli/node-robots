const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3');
const CREDENTIALS = require('../credentials/algorithmia.json'); 

const languageTranslator = new LanguageTranslatorV3({
  iam_apikey: CREDENTIALS.TRADUTOR.apikey,
  url: 'https://gateway.watsonplatform.net/language-translator/api/',
  version: '2018-02-16',
});
 
/*languageTranslator.translate(
  {
    text: 'A sentence must have a verb',
    source: 'en',
    target: 'pt'
  })
  .then(translation => {
    console.log(JSON.stringify(translation, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });*/
 
languageTranslator.identify(
  {
    text:
      'The language translator service takes text input and identifies the language used.'
  })
  .then(language => {
    console.log(JSON.stringify(language, null, 2));
  })
  .catch(err => {
    console.log('error:', err);
  });