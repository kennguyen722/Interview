/**
 * Write a function that takes in a String and returns a count for each letter. 
> For example: "Hello" --> {"H":1, "e":1, "l": 2, "o": 1} in javascript
 */
function countLetters(str) {
  const result = {};

  for (const char of str) {
    result[char] = (result[char] || 0) + 1;
  }

  return result;
}

console.log(countLetters("Hello"));

/**
 * Using reduce
 * 
 */
function countLetters(str) {
  return [...str].reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}
console.log(countLetters("Hello"));