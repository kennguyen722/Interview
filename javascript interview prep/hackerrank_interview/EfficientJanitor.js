'use strict';

const fs = require('fs');

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
 * Complete the 'efficientJanitor' function below.
 *
 * The function is expected to return an INTEGER.
 * The function accepts FLOAT_ARRAY weight as parameter.
 */

function efficientJanitor(weight) {
    // Write your code here
    // 1. Sort weights
    weight.sort((a,b) => a -b);
    
    let left = 0;
    let right = weight.length - 1;
    let trip = 0;
    
    while(left <= right) {
        // If lightest + heaviest can go together
        if(weight[left] + weight[right] <= 3.0) {
            left++;
        }
        
        // Always take the heaviest
        right--;
        trip++;
    }
    return trip
}
function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

    const weightCount = parseInt(readLine().trim(), 10);

    let weight = [];

    for (let i = 0; i < weightCount; i++) {
        const weightItem = parseFloat(readLine().trim());
        weight.push(weightItem);
    }

    const result = efficientJanitor(weight);

    ws.write(result + '\n');

    ws.end();
}

/*
Output:
The function efficientJanitor returns the minimum number of trips the janitor needs to carry all the weights without exceeding the 3.0 weight limit per trip. Each trip can carry either one or two items, and the function pairs the lightest and heaviest items whenever possible to minimize the number of trips.
For example, given weights [1.5, 2.0, 1.0, 1.5], the sorted array is [1.0, 1.5, 1.5, 2.0]. The janitor can pair 1.0 + 2.0 (trip 1) and 1.5 + 1.5 (trip 2), resulting in a total of 2 trips, which is the minimum possible.  
This approach ensures that the heaviest items are always considered first, and whenever possible, they are paired with the lightest remaining item to maximize the load per trip without exceeding the 3.0 weight limit. If the heaviest item cannot be paired with the lightest, it is sent alone, and the process continues until all items are accounted for.
This greedy two-pointer strategy guarantees that each trip carries as much weight as possible without exceeding the limit, thereby minimizing the total number of trips required.
*/