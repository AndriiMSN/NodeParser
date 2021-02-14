const {CarParser} = require('../Core');


class AutoRia extends CarParser {
    constructor(url, page) {
        super(url, page)
        this.selectorLink = ".item.ticket-title a"
        this.currentUrl = `${this.url}${this.page}&size=10`
    }

    async run() {

        const links = await this.getLinks(this.currentUrl)
        const getInfoAboutCar = async (links) => {
            for (const el of links) {
                let carPage = await this.getPage(el)
                let price = carPage('.auto-head_title.bold.mb-15').text()
                console.log(price)
            }
        }
        await getInfoAboutCar(links)


        // console.log(('PAGE === ' + this.page).bgRed)
        // result = result.concat(links)
        // console.log((result))
        //
        // while (await this.askQuestion('Next page?')) {
        //     this.page++
        //     console.log(('PAGE === ' + this.page).bgRed)
        //     this.currentUrl = `${this.url}${this.page}&size=10`
        //
        //     const links = await this.getLinks()
        //     result = result.concat(links)
        //     console.log(links)
        // }
        // return result
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