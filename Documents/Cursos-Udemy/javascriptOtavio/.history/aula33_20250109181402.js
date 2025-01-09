// let a = "A";
// let b = a; // copia
// console.log(a, b);

// a = "Outra coisa";
// console.log(a, b);

//tipos de dados por referencias

let a = [1, 2, 3];
let b = a;
console.log(a, b);

a.push(4);
console.log(a, b);

b.pop();
console.log(a, b);
