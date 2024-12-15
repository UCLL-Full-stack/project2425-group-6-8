

const createMessage = async (messageData: { userId: number; groupId: number; message: string }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const createdMessage = await response.json();
    return createdMessage;
  } catch (error) {
    console.error("Failed to create message:", error);
    throw error;
  }
};

const getAllMessages = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const messages = await response.json();
    return messages;
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    throw error;
  }
};

const getMessageById = async (messageId: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/${messageId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const message = await response.json();
    return message;
  } catch (error) {
    console.error(`Failed to retrieve message with ID ${messageId}:`, error);
    throw error;
  }
};

const MessageService = {
  createMessage,
  getAllMessages,
  getMessageById,
};

export default MessageService;
