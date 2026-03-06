const countLetter= (str) => {
	const obj1 = {}, c=0
	
	for(let i =0;i<str.length; i++){
		if(!obj1[str[i]]) {
			obj1[str[i]] = 0
		}
		obj1[str[i]]++
	}
	return obj1
}

console.log(countLetter('users'))

//result: {u: 1, s:2, e:1, r:1}

//Javascript

const person = {
    name: 'Max',
    age: 29,
    greet() {
        console.log('Hi, I am ', this.name);
    }
}

const hobbies =['Sport', 'Cooking'];

const copiedArray = [...hobbies]; // Spread operator, pull all data and assign to new variable
console.log(copiedArray);

const toArray = (...args) => { //REST operator: merge arguments
    return [args];
}
console.log(toArray(1,2,3,4));

const {name, age} = person;//Destructuring
console.log(name, age);

// Async
setTimeout(() => {
    console.log('Timer is an Async sample.');
}, 1000); 

// Promise