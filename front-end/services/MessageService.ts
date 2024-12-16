const loggedInUserData = (() => {
  if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
})();

const createMessage = async (messageData: { groupId: number; message: string }) => {
  console.log('Logged in user data:', loggedInUserData);

  try {
    if (!loggedInUserData) {
      throw new Error("User not logged in.");
    }

    console.log('Creating message for group ID:', messageData.groupId);
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
    console.log('Created message response:', createdMessage);
    return createdMessage;
  } catch (error) {
    console.error("Failed to create message:", error);
    throw error;
  }
};

const getAllMessages = async (groupId?: number) => {
  console.log("Logged in user token:", loggedInUserData?.token);

  try {
    const url = groupId
      ? `${process.env.NEXT_PUBLIC_API_URL}/messages?groupId=${groupId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/messages`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loggedInUserData.token}`
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const messages = await response.json();
    console.log('Messages fetched:', messages);
    return messages;
  } catch (error) {
    console.error("Failed to retrieve messages:", error);
    throw error;
  }
};

const MessageService = {
  createMessage,
  getAllMessages,
};

export default MessageService;
