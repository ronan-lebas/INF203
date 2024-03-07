"use strict";

import {Stud, ForStudent} from "./exercise3.mjs";

import fs from "fs";

export class Prmtn {
    constructor() {
        this.students = [];
    }

    add(student) {
        this.students.push(student);
    }

    size() {
        return this.students.length;
    }

    get(i) {
        return this.students[i];
    }

    print() {
        let output = "";
        for (let student of this.students) {
            output += student.toString() + "\n";
        }
        console.log(output);
        return output;
    }

    write() {
        return JSON.stringify(this.students);
    }

    read(str) {
        let parsed = JSON.parse(str);
        this.students = parsed.map(student => {
            if (student.nationality) return new ForStudent(student.lastName, student.firstName, student.id, student.nationality);
            else return new Stud(student.lastName, student.firstName, student.id);
        })
    }

    saveTo(fileName) {
        const data = this.write();
        fs.writeFileSync(fileName, data);
    }

    readFile(fileName) {
        const data = fs.readFileSync(fileName, "utf8");
        this.read(data);
    }
}