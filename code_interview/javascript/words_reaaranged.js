/****
 * Write a function that takes in a string sentence and returns a new sentence where the words are rearranged by their length. 
> For example: “hello friendly cat” --> “cat hello friendly”  javascript
 */
function rearrangeByWordLength(sentence) {
  return sentence
    .split(' ')
    .sort((a, b) => a.length - b.length)
    .join(' ');
}

console.log(rearrangeByWordLength("hello friendly cat"));