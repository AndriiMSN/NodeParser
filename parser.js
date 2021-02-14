const request = require('request');
const cheerio = require('cheerio');
// const moment = require('moment');
const readline = require('readline');
const colors = require('colors');

//Flag that allows to process automatically. Don't use it ;)
const AUTOMATIC = false;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

class CarParser {

    constructor(url, page, selectorLink) {
        this.url = url
        this.page = page
        this.selectorLink = selectorLink
        this.currentUrl = ''
    }

    async askQuestion(question) {
        return new Promise(resolve => {
            rl.question(question + ' y/n(default y)', (answer) => {
                if (AUTOMATIC || !answer || answer === 'y') {
                    return resolve(true);
                }
                return resolve(false);
            });
        })
    }

    async getPage() {
        console.log(this.currentUrl.bgBlue)
        return new Promise((resolve, reject) => {
            request({
                url: this.currentUrl,
                headers: {
                    //Don't forget about User Agent, otherwise it's possible you will be detected like a bot.
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
                }
            }, (error, response, body) => {
                if (error) {
                    return reject(error);
                }

                //Add "decodeEntities" flag to avoid decoding entities and be able to search by selectors
                return resolve(cheerio.load(body, {decodeEntities: false}));
            });
        });
    }

    async getLinks() {
        const arrayLinks = []

        try {
            let currentPage = await this.getPage();

            const links = currentPage(this.selectorLink);
            links.each((index, value) => {
                let link = currentPage(value).attr('href');
                arrayLinks.push(link)
            })

        } catch (e) {
            console.log(e)
        }
        return arrayLinks
    }

}

class AutoRia extends CarParser {
    constructor(url, page) {
        super(url, page)
        this.selectorLink = ".item.ticket-title a"
        this.currentUrl = `${this.url}${this.page}&size=10`
    }

    async run() {

        let result = []
        const links = await this.getLinks()
        console.log(('PAGE === ' + this.page).bgRed)
        result = result.concat(links)
        console.log((result))

        while (await this.askQuestion('Next page?')) {
            this.page++
            console.log(('PAGE === ' + this.page).bgRed)
            this.currentUrl = `${this.url}${this.page}&size=10`

            const links = await this.getLinks()
            result = result.concat(links)
            console.log(links)
        }
        return result
    }
}


module.exports = {
    AutoRia: async function (url, page) {
        try {
            await new AutoRia(url, page).run();
        } catch (e) {
            throw e;
        }
    }
};