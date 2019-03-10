const fs = require('fs');

const { fetchUrl } = require('./fetchUrlsFromSite')
const bucketSize = 5;

let fetchList = ["https://www.medium.com"]
let gotObj = {
    "https://www.medium.com": false
}

/**
 * function to write to file
 * @param {String} line 
 */
const writeToFile = (line) => {
    fs.appendFile("sample.txt", line + "\n", (err) => {
        console.log(line)
    })
}
/**
 * This function is to get mergedarray from array of arrays
 * @param {Array} accumulator 
 * @param {Array} current 
 */
const reducerFunction = (accumulator, current) => [...accumulator, ...current]

/**
 * Promisified timeout function
 * 
 */
const waitFunction = () => new Promise(resolve => setTimeout(() => resolve(true), 1000))

/**
 * get first n elements from the array to fetch
 */
const getTopElementsFromFetchList = () => {
    let tempFetchList = [];

    for (let i = 0; i < bucketSize && i < fetchList.length; i++) {
        tempFetchList.push(fetchList[i]);
    }
    return tempFetchList;
}

/**
 * This function gets all the fetched url and writes only that urls which are not already present
 * @param {Array} mergedResults 
 * @param {Number} spliceSize 
 */
const insertIntoGotListAndPushToFetchList = (mergedResults, spliceSize) => {
    // console.log(mergedResults)
    for (let i = 0; i < mergedResults.length; i++) {
        if (!gotObj[mergedResults[i]]) {
            gotObj[mergedResults[i]] = true;
            writeToFile(mergedResults[i]);

            fetchList.push(mergedResults[i])
        }
    }
    fetchList.splice(0, spliceSize);
    // Remove elements from fetchList whose results are passed into this function

}

mainLoop = async () => {
    let done = true, tries = 0;
    try {
        while (done && tries < 5) {
            let fetchArray = await getTopElementsFromFetchList();
            if (fetchArray.length) {
                let funcArray = [];
                for (let i = 0; i < fetchArray.length; i++) {
                    funcArray.push(fetchUrl(fetchArray[i]));

                }
                let fetchResults = await Promise.all(funcArray)
                let mergedResults = fetchResults.reduce(reducerFunction, []);
                await insertIntoGotListAndPushToFetchList(mergedResults, fetchArray.length);
                tries = 0;
            }
            else {
                // await waitFunction();
                if (fetchList.length == 0) {
                    done = false;
                }
                tries++;
            }
        }
    } catch (e) {
        console.log("Exception", e)
    }

}
mainLoop()
