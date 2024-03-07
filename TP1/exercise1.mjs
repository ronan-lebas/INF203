"use strict";

// iterative
export function fiboIt(n) {
    let a = 0;
    let b = 1;
    let c;
    for (let i = 2; i <= n; i++) {
        c = a + b;
        a = b;
        b = c;
    }
    return c;
}

// programmed recursively
export function fibonaRec(n) {
    if (n <= 1) return n;
    else return fibonaRec(n - 1) + fibonaRec(n - 2);
}

// use a loop
export function fibArr(t) {
    let arr = [];
   if (t != null) t.forEach(n => arr.push(fibonaRec(n)));
   return arr;
}

// using map
export function fibMap(t) {
    return t.map(n => fibonaRec(n));
}