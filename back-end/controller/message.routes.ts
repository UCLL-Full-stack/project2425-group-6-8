import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';

const messageRouter = express.Router();

// Create a message
messageRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messageData = req.body;
        const result = await messageService.createMessage(messageData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Get all messages (with optional group filtering)
messageRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.query;
        let result;
        if (groupId) {
            result = await messageService.getAllMessages(parseInt(groupId as string, 10));
        } else {
            result = await messageService.getAllMessages();
        }
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Get new messages based on the last timestamp
messageRouter.get('/new', async (req: Request, res: Response) => {
    const { groupId, lastTimestamp } = req.query;

    if (!groupId || !lastTimestamp) {
        return res.status(400).send({ error: 'Group ID and last timestamp are required' });
    }

    try {
        // Ensure the lastTimestamp is in the correct format
        const parsedTimestamp = new Date(lastTimestamp as string);
        if (isNaN(parsedTimestamp.getTime())) {
            return res.status(400).send({ error: 'Invalid timestamp format.' });
        }

        const messages = await messageService.getNewMessages(
            parseInt(groupId as string, 10), 
            parsedTimestamp.toISOString() // Convert to ISO string for consistency
        );

        // Log the fetched messages for debugging
        console.log('Fetched messages:', messages);

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching new messages:', error);
        res.status(500).send({ error: 'Failed to fetch new messages' });
    }
});

messageRouter.get('/:id', async (req, res) => {
  const messageId = parseInt(req.params.id, 10);
  if (isNaN(messageId)) {
    return res.status(400).send({ error: 'Invalid message ID' });
  }
  try {
    const message = await messageService.getMessageById(messageId);

    if (!message) {
      return res.status(404).send({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch message' });
  }
});

export { messageRouter };
