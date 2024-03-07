"use strict";


export function wc(str) {
    const words = str.split(" ");
    const wordCount = {};

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (wordCount[word]) {
            wordCount[word]++;
        } else {
            wordCount[word] = 1;
        }
    }

    return wordCount;
}


export class WordL {
    constructor(str) {
        this.words = str.split(" ").sort();
        this.wordCount = {};

        for (let i = 0; i < this.words.length; i++) {
            const word = this.words[i];
            if (this.wordCount[word]) {
                this.wordCount[word]++;
            } else {
                this.wordCount[word] = 1;
            }
        }
    }

    getWords() {
        return Array.from(new Set(this.words));
    }

    maxCountWord() {
        let maxCount = 0;
        let maxWord = "";

        for (const word in this.wordCount) {
            if (this.wordCount[word] > maxCount) {
                maxCount = this.wordCount[word];
                maxWord = word;
            }
        }

        return maxWord;
    }

    minCountWord() {
        let minCount = Infinity;
        let minWord = "";

        for (const word in this.wordCount) {
            if (this.wordCount[word] < minCount) {
                minCount = this.wordCount[word];
                minWord = word;
            }
        }

        return minWord;
    }

    getCount(word) {
        return this.wordCount[word] || 0;
    }

    applyWordFunc(f) {
        let results = [];
        for (let i = 0; i < this.getWords().length; i++) {
            results.push(f(this.getWords()[i]));
        }
        return results;
    }
}