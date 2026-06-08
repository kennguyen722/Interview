'use strict';

const fs = require('fs');
const https = require('https');
const { Promise } = require('node-fetch');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}

/*
 * Complete the 'getAverageTemperatureForUser' function below.
 *
 * URL for cut and paste
 * https://jsonmock.hackerrank.com/api/medical_records?userId=<userId>&page=<page>
 *
 * The function is expected to return a String value.
 * The function accepts a userId argumnent (Integer).
 * 
 * In the case of an empty array result, return value '0'
 */

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = "";
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}
async function getAverageTemperatureForUser(userId) {
    let page =1;
    let totalPages = 1;
    
    let totalTemp = 0;
    let count = 0;
    
    while (page <= totalPages) {
        const url = `https://jsonmock.hackerrank.com/api/medical_records?userId=${userId}&page=${page}`
        const response = await fetch(url);
        
        totalPages = response.total_pages;
        
        for (const record of response.data) {
            if(record.vitals && record.vitals.bodyTemperature != null) {
                totalTemp += record.vitals.bodyTemperature;
                count++;
            }
        }
        page++;
    }
    if(count === 0) return 0;
    const average = totalTemp/count;
    return average.toFixed(1);
}


async function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const id = parseInt(readLine());

    const result = await getAverageTemperatureForUser(id);
    
    ws.write(result);

    ws.end();
}