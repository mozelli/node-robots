const robots = {
    input: require('./robots/user-input'),
    text: require('./robots/text'),
    state: require('./robots/state'),
    images: require('./robots/images'),
    translator: require('./robots/translator')
};

async function start() {

    robots.input()
    await robots.text();
    await robots.images();

    const content = robots.state.load();
    console.dir(content, { depth: null });
}

start();