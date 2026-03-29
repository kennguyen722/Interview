/*
In this challenge, you will be given a partially completed implementation of an Employee class and an Engineer class that inherits from Employee. Your task is to complete the implementation of the Engineer class by adding the necessary code to establish the inheritance relationship and implement the required methods.
The Employee class has a constructor that takes a title as an argument and sets it as an instance property. It also has two methods: setTitle, which updates the title, and getTitle, which returns the current title.
The Engineer class should inherit from Employee and have its own constructor that takes a title and an isManager boolean as arguments. The Engineer class should also have two methods: setIsManager, which updates the isManager property, and getIsManager, which returns the current value of isManager.
To establish the inheritance relationship between Engineer and Employee, you will need to use the Object.create() method to set the prototype of Engineer to an instance of Employee. This will allow instances of Engineer to access the methods defined in Employee.
You will also need to ensure that the constructor property of Engineer.prototype is set correctly to Engineer after setting up the prototype chain.
Once you have completed the implementation, you can test your code by running the provided main function, which creates an instance of Engineer and demonstrates the functionality of the methods.
Note: The input and output format is handled by the provided main function, so you only need to focus on implementing the Engineer class correctly.
*/

'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding("ascii");
let inputString = "";
let currentLine = 0;

process.stdin.on("data", function (chunk) {
    inputString += chunk;
});
process.stdin.on("end", function () {
    inputString = inputString.split('\n');
    main();
});

function readLine() {
  return inputString[currentLine++];
}

function Employee(title) {
    this.title = title;
}

Employee.prototype.setTitle = function(title) {
    this.title = title;
};

Employee.prototype.getTitle = function() {
    return this.title;
};

function Engineer(title, isManager) {
    Employee.call(this, title);
    this.isManager = isManager;
}

Engineer.prototype = Object.create(Employee.prototype);
Engineer.prototype.constructor = Engineer;

Engineer.prototype.setIsManager = function(isManager) {
    this.isManager = isManager;
};

Engineer.prototype.getIsManager = function() {
    return this.isManager;
};

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);
    
    var inputs = readLine().split(' ');
    var engineerObject = new Engineer(inputs[0], inputs[1].toLowerCase() === 'true');
    
    ws.write(`Initial Employee Profile - Title is ${engineerObject.getTitle()}. ${engineerObject.getIsManager() ? 'Is' : 'Is not'} a Manager\n`)
    
    engineerObject.setTitle(readLine());
    engineerObject.setIsManager(readLine().toLowerCase() === 'true');
    
    ws.write(`Final Employee Profile - Title is ${engineerObject.getTitle()}. ${engineerObject.getIsManager() ? 'Is' : 'Is not'} a Manager\n`)
    
    ws.write(`Engineer.prototype has property setTitle: ${Engineer.prototype.hasOwnProperty('setTitle')}\n`);
    ws.write(`Engineer.prototype has property getTitle: ${Engineer.prototype.hasOwnProperty('getTitle')}\n`);
    ws.write(`Engineer.prototype has property setIsManager: ${Engineer.prototype.hasOwnProperty('setIsManager')}\n`);
    ws.write(`Engineer.prototype has property getIsManager: ${Engineer.prototype.hasOwnProperty('getIsManager')}\n`);
}

/*
Why this works:

Employee stores title
Engineer calls Employee.call(this, title) to inherit instance data
Engineer.prototype = Object.create(Employee.prototype) makes Engineer inherit getTitle and setTitle
setIsManager and getIsManager are defined directly on Engineer.prototype

Because of that:

Engineer.prototype.hasOwnProperty('setTitle') → false
Engineer.prototype.hasOwnProperty('getTitle') → false
Engineer.prototype.hasOwnProperty('setIsManager') → true
Engineer.prototype.hasOwnProperty('getIsManager') → true
*/

/*
Input:
Software Engineer true 
Senior Software Engineer false
Output:
Initial Employee Profile - Title is Software Engineer. Is a Manager 
Final Employee Profile - Title is Senior Software Engineer. Is not a Manager
Engineer.prototype has property setTitle: false
Engineer.prototype has property getTitle: false
Engineer.prototype has property setIsManager: true
Engineer.prototype has property getIsManager: true
*/
