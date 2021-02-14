const {AutoRia} = require('./Sites/AutoRia');
const colors = require('colors');

/**
 * Start function
 *
 * @returns {Promise<void>}
 */
async function start() {
    try {
        await AutoRia('https://auto.ria.com/uk/search/?indexName=auto,order_auto,newauto_search&country.import.usa.not=-1&price.currency=1&abroad.not=0&custom.not=1&page=',
            0);
    } catch (e) {
        console.log(e);
    }

    process.exit(0);
}

start();