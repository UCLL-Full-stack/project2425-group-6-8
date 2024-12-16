const loggedInUserData = (() => {
  if (typeof localStorage === "undefined") {
      console.warn("localStorage is not defined.");
      return null;
  }
  const item = localStorage.getItem("loggedInUser");
  return item ? JSON.parse(item) : null;
})();

const getMessagesStream = (groupId: number) => {
  if (!loggedInUserData?.token) {
    throw new Error("No token found");
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/messages/stream?groupId=${groupId}&token=${loggedInUserData.token}`;

  const eventSource = new EventSource(url, { withCredentials: true });

  eventSource.onmessage = (event) => {
    try {
      const newMessages = JSON.parse(event.data);
      console.log("New messages received:", newMessages);
    } catch (error) {
      console.error("Error parsing SSE data:", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("Error with SSE connection:", error);
    eventSource.close();
  };

  return eventSource;
};

const createMessage = async (messageData: { groupId: number; message: string }) => {
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

const MessageService = {
  createMessage,
  getAllMessages,
  getMessagesStream,
};

export default MessageService;
