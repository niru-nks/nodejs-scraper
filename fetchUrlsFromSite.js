const rp = require('request-promise');
const $ = require('cheerio');
const fetchUrl = (pageUrl) => {
    return new Promise((resolve, reject) => {
        let responseToSend = []

        //request the provided url
        rp(pageUrl)
            .then(response => {

                let resp = $('a', response)
                for (let i = 0; i < resp.length; i++) {
                    // get all the href parameters having medium. in it (beleiving these are all medium sites)
                    if (resp[i].attribs.href.indexOf("medium.") !== -1) {
                        responseToSend.push(resp[i].attribs.href);
                    }
                }
                return resolve(responseToSend)
            })
            .catch(error => {
                // console.log(error)
                return resolve([])  // this is in case of address not found (which was happening in some cases)
            })
    })
}
module.exports.fetchUrl = fetchUrl;
