export default class MessageGenerator {
    constructor(
        private topWords: string[],
        private messages: string[][]
    ) {}

    generateResponse(message: string): string {
        const words = getWords(message);
        const desiredWord = words.length ? words[0] : '';

        let messages = this.messages.filter(message => message.some(word => word == desiredWord));
        if (messages.length == 0)
            messages = this.messages.filter(message => message.some(word => word.includes(desiredWord)));
        if (messages.length == 0)
            messages = this.messages.filter(message => this.topWords.some(word => message.includes(word)));

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
