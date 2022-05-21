import { CUSTOM_TOP_WORDS } from './customTopWords';
import { MESSAGES, TOP_WORDS } from './data/topWords';
import MessageGenerator from './MessageGenerator';

const messageGenerator = new MessageGenerator(CUSTOM_TOP_WORDS, MESSAGES);
const input = process.argv[2];
const response = messageGenerator.generateResponse(input);
console.log(response);