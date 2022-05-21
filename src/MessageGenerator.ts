import lodash from 'lodash';
import log4js from 'log4js';

const OPTIMAL_CHAIN_MIN_LENGTH = 5;
const OPTIMAL_CHAIN_MAX_LENGTH = 10;

export default class MessageGenerator {

    logger = log4js.getLogger('MessageGenerator');

    constructor(
        private topWords: string[],
        private messages: string[][]
    ) {}

    generateResponse(message: string): string {
        const words = getWords(message);
        const desiredWord = words.length ? words[0] : '';
        const messages1 = this.findMessageCandidates(desiredWord);
        const message1 = lodash.sample(messages1);
        if (message1) {
            let desiredWordIndex = message1.indexOf(desiredWord);
            if (desiredWordIndex >= 0) {
                const nextTopWordIndex = this.findNextTopWordIndex(message1, desiredWordIndex);
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
            if (this.topWords.includes(word) && sentence.length >= OPTIMAL_CHAIN_MIN_LENGTH)
                break;
            if (word == '.' && sentence.length >= OPTIMAL_CHAIN_MIN_LENGTH)
                break;
            if (word != '.')
                if (direction > 0)
                    sentence.push(word);
                else
                    sentence.unshift(word);
        }
        return sentence;
    }

    private findNextTopWordIndex(message: string[], index: number) {
        for (let i = index + 1; i < message.length; i++)
            if (this.topWords.includes(message[i]))
                return i;
        return -1;
    }

    private findPreviousTopWordIndex(message: string[], index: number) {
        for (let i = index - 1; 0 <= i; i--)
            if (this.topWords.includes(message[i]))
                return i;
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
