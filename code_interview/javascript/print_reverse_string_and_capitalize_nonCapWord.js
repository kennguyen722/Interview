
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


/* As in the previous problem, write a function that takes in a string sentence and returns a
 new sentence where the words are rearranged by their length, but this time, 
 each word should preserve the capitalization of the word that was in its place in the original sentence. 
> For example: “Hello cat” --> “Cat hello”  */


function print(str) {
    const words = str.split(' ');

    const checkCap = words.map(word => {
        if(word[0] === word[0].toUpperCase()) return true;
        return false;
    });

    const sortedWords = [...words].sort((x, y) => x.length - y.length);
    const newStrCap = sortedWords.map((word, i) => {
        if(checkCap[i]) return word[0].toUpperCase() + word.slice(1).toLowerCase();
        return word.toLowerCase();
    });
    return newStrCap.join(' ');
}

console.log(print("Hello cat"));
