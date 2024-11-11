import { Message, User } from '../model';

const messages: Message[] = [];

const dummyUser = new User({
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    nickname: 'alice',
});

const dummyMessage = new Message({
    user: dummyUser,
    timestamp: new Date().toISOString(),
    message: 'Hello, everyone!',
});

messages.push(dummyMessage);

const createMessage = (message: Message): Message => {
    messages.push(message);
    console.log('Message created:', message.getMessage());
    return message;
};

const getAllMessages = (): Message[] => messages;

const getMessageById = (id: number): Message | undefined => {
    return messages.find(message => message.getId() === id);
};

export default { createMessage, getAllMessages, getMessageById };
