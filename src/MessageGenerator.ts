import lodash from 'lodash';
import log4js from 'log4js';

const OPTIMAL_CHAIN_MIN_LENGTH = 3;
const OPTIMAL_CHAIN_MAX_LENGTH = 10;

export default class MessageGenerator {
    logger = log4js.getLogger('MessageGenerator');

    constructor(
        private topWords: string[],
        private messages: string[][]
    ) {
        this.messages = this.messages
            .filter(message => message.length > 2)
            .filter(message => this.topWords.some(word => message.includes(word)));
    }

    generateResponse(message: string): string {
        const words = getWords(message);
        const desiredWord = words.length ? words[0] : '';
        const messages1 = this.findMessageCandidates(desiredWord);
        const message1 = lodash.sample(messages1);
        if (message1) {
            const topWordIndex1 = this.findRandomTopWordIndex(message1);
            const topWord = message1[topWordIndex1];
            const leftChain1 = this.findChain(message1, topWordIndex1, -1);
            const rightChain1 = this.findChain(message1, topWordIndex1, 1);

            const messages2 = this.messages
                .filter(message => message.includes(topWord) && message != message1);
            console.log(topWord);
            const message2 = lodash.sample(messages2);
            if (message2) {
                const topWordIndex2 = this.findRandomWordIndex(message2, topWord);
                const leftChain2 = this.findChain(message2, topWordIndex2, -1);
                const rightChain2 = this.findChain(message2, topWordIndex2, 1);

                console.log(formatSentence(message1), '[L] ' + formatSentence(leftChain1), '[R] ' + formatSentence(rightChain1));
                console.log(formatSentence(message2), '[L] ' + formatSentence(leftChain2), '[R] ' + formatSentence(rightChain2));

                const favor1 = getFavor(leftChain1) + getFavor(rightChain2);
                const favor2 = getFavor(leftChain2) + getFavor(rightChain1);
                const chain = favor1 > favor2
                    ? connect(leftChain1, rightChain2)
                    : connect(leftChain2, rightChain1);
                return formatSentence(chain);
            }
        }
        return 'Unable to generate a response.';
    }

    private findChain(message: string[], index: number, direction: number): string[] {
        const sentence = [message[index]];
        while (sentence.length < OPTIMAL_CHAIN_MAX_LENGTH) {
            index += direction;
            if (index < 0 || index >= message.length)
                break;
            const word = message[index];
            if (this.topWords.includes(word) && sentence.length > OPTIMAL_CHAIN_MIN_LENGTH)
                break;
            if (word == '.' && sentence.length > OPTIMAL_CHAIN_MIN_LENGTH)
                break;
            if (word != '.')
                if (direction > 0)
                    sentence.push(word);
                else
                    sentence.unshift(word);
        }
        return sentence;
    }

    private findRandomTopWordIndex(message: string[]) {
        const topWords = message
            .map((word, index) => ({word, index}))
            .filter(entry => this.topWords.includes(entry.word));
        const topWordEntry = lodash.sample(topWords);
        if (topWordEntry)
            return topWordEntry.index;
        else
            return -1;
    }

    private findRandomWordIndex(message: string[], word: string) {
        const words = message
            .map((word, index) => ({word, index}))
            .filter(entry => entry.word == word);
        const wordEntry = lodash.sample(words);
        if (wordEntry)
            return wordEntry.index;
        else
            return -1;
    }

    private findMessageCandidates(desiredWord: string) {
        let messages = this.messages.filter(message => message.some(word => word == desiredWord));
        if (messages.length == 0)
            messages = this.messages.filter(message => message.some(word => word.includes(desiredWord)));
        if (messages.length == 0)
            messages = this.messages.filter(message => this.topWords.some(word => message.includes(word)));
        if (messages.length == 0)
            messages = this.messages;
        console.log(messages.length);
        return messages;
    }
}

function getWords(text: string) {
    const words: string[] = [];
    let word = '';
    for (const character of text) {
        if (isLetter(character))
            word += character;
        else if (word.length) {
            words.push(word.toLowerCase());
            word = '';
        }
    }
    if (word.length)
        words.push(word.toLowerCase());
    if (words.length && words[words.length - 1] == '.')
        words.pop();
    return words;
}

function isLetter(text: string) {
    return text.toString().toLowerCase() != text.toString().toUpperCase();
}

function getRandomInteger(limit: number) {
    return Math.floor(Math.random() * limit);
}

function formatSentence(message: string[]): string {
    return lodash.upperFirst(message.join(' ')) + '.';
}

function isOptimalLength(array: any[]): boolean {
    return OPTIMAL_CHAIN_MIN_LENGTH < array.length && array.length < OPTIMAL_CHAIN_MAX_LENGTH;
}

function getFavor(array: any[]): number {
    if (array.length == 0)
        return -1;
    if (array.length == 1)
        return 0;
    if (isOptimalLength(array))
        return 2;
    return 1;
}

function connect(chain1: string[], chain2: string[]): string[] {
    if (chain1.length) {
        chain1 = chain1.slice();
        chain1[chain1.length - 1] = '_' + chain1[chain1.length - 1] + '_';
    }
    return lodash.concat(chain1, chain2.slice(1));
}
