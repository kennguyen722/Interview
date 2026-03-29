'use strict';

const cliArgs = process.argv.slice(2);

// Local mode: allow direct execution as `node getRemovableIndices.js <str1> <str2>`.
if (cliArgs.length >= 2) {
    const str1 = cliArgs[0];
    const str2 = cliArgs[1];
    const result = getRemovableIndices(str1, str2);
    process.stdout.write(result.join('\n') + '\n');
    process.exit(0);
}

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
 * Complete the 'getRemovableIndices' function below.
 *
 * The function is expected to return an INTEGER_ARRAY.
 * The function accepts following parameters:
 *  1. STRING str1
 *  2. STRING str2
 */
function isSubSequence(s, t) {
    let i = 0;
    let j = 0;
    while(i < s.length && j < t.length) {
        if(s[i] === t[j]) {
            j++;
        }
        i++;
    }
    return j === t.length;
}

function getRemovableIndices(str1, str2) {
    // Write your code here
    if(!isSubSequence(str1, str2)) return [-1];
    const n = str1.length;
    const m = str2.length;

    const left = new Array(n + 1).fill(0);
    const right = new Array(n + 1).fill(0);

    // left[i] = how many chars of str2 can be matched
    // using str1[0..i-1]
    let j = 0;
    for (let i = 0; i < n; i++) {
        left[i + 1] = left[i];
        if (j < m && str1[i] === str2[j]) {
            j++;
            left[i + 1]++;
        }
    }

    // right[i] = how many chars from the end of str2 can be matched
    // using str1[i..n-1]
    j = m - 1;
    for (let i = n - 1; i >= 0; i--) {
        right[i] = right[i + 1];
        if (j >= 0 && str1[i] === str2[j]) {
            j--;
            right[i]++;
        }
    }

    const result = [];

    for (let i = 0; i < n; i++) {
        // Remove str1[i]:
        // chars matched before i + chars matched after i
        if (left[i] + right[i + 1] >= m) {
            result.push(i);
        }
    }

    return result.length > 0 ? result: [-1];
}

function main() {
    const str1 = readLine();

    const str2 = readLine();

    const result = getRemovableIndices(str1, str2);

    process.stdout.write(result.join('\n') + '\n');
}

/* 
Output:
1
2
3
input:
abcde  
ace
*/ 