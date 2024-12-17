import { Message
 } from "@types";

const getLoggedInUserData = () => {
  if (typeof localStorage === "undefined") {
    console.warn("localStorage is not defined.");
    return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
};

const createMessage = async (messageData: { groupId: number; message: string }) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData.token}`,
      },
      body: JSON.stringify({
        user: { id: loggedInUserData.id },
        group: { id: messageData.groupId },
        message: messageData.message,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const createdMessage = await response.json();
    console.log("Created message response:", createdMessage);
    return createdMessage;
  } catch (error) {
    console.error("Failed to create message:", error);
    throw error;
  }
};

const getAllMessages = async (groupId?: number) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("User not logged in.");
  }

  try {
    const url = groupId
      ? `${process.env.NEXT_PUBLIC_API_URL}/messages?groupId=${groupId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/messages`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const messages = await response.json();
    console.log("Messages fetched:", messages);
    return messages;
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    throw error;
  }
};

const getMessagesStream = async (groupId: number, onNewMessage: (messages: Message[]) => void) => {
  const loggedInUserData = getLoggedInUserData();
  if (!loggedInUserData?.token) {
    throw new Error("No token found");
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/messages/stream/${groupId}`;
    
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUserData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching new messages: ${response.statusText}`);
        }

        const newMessages: Message[] = await response.json();
        if (newMessages.length > 0) {
          onNewMessage(newMessages);  
        }
      } catch (error) {
        console.error("Error fetching new messages:", error);
        clearInterval(intervalId);  
      }
    }, 5000); 

    return () => clearInterval(intervalId);  

  } catch (error) {
    console.error("Error with SSE connection:", error);
    throw error;
  }
};


const MessageService = {
  createMessage,
  getAllMessages,
  getMessagesStream,
};

export default MessageService;
