import { MessageInput } from '../types';
import { Message } from '../model/message';
import messageDb from '../repository/message.db';
import UserService from '../service/user.service';
import GroupService from '../service/group.service';


const createMessage = async (messageData: MessageInput): Promise<Message> => {
    if (!messageData.user?.id) throw new Error('User ID is required.');
    if (!messageData.group.id) throw new Error('Group ID is required.');  // Add validation for groupId
    
    const user = await UserService.getUserById(messageData.user.id);
    if (!user) throw new Error('A valid user is required.');

    const group = await GroupService.getGroupById(messageData.group.id);  // Add logic to verify group exists
    if (!group) throw new Error('A valid group is required.');
    
    const newMessage = new Message({
        user,
        group,  // Add group to the message
        timestamp: messageData.timestamp,
        message: messageData.message,
    });

    return await messageDb.createMessage(newMessage);
};



const getMessageById = async (id: number): Promise<Message | null> => {
    return await messageDb.getMessageById(id);  
};

const getAllMessages = async (groupId?: number): Promise<Message[]> => {
  return await messageDb.getAllMessages(groupId); 
};


export default { createMessage, getMessageById, getAllMessages };
