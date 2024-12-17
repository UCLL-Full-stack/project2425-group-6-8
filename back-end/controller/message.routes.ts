import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';
import { MessageInput } from '../types';

const messageRouter = express.Router();

/**
 * @swagger
 * /messages:
 *   post:
 *      security:
 *        - bearerAuth: []
 *      summary: Create a new message.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/MessageInput'
 *      responses:
 *         200:
 *            description: The created message.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Message'
 */
messageRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messageData: MessageInput = req.body;
        const result = await messageService.createMessage(messageData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all messages or messages for a specific group.
 *     parameters:
 *        - in: query
 *          name: groupId
 *          required: false
 *          description: The ID of the group to filter messages by.
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: List of messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 */
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

/**
 * @swagger
 * /messages/stream:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Stream messages in real-time.
 *     parameters:
 *        - in: query
 *          name: groupId
 *          required: true
 *          description: The ID of the group to stream messages for.
 *          schema:
 *            type: integer
 *     responses:
 *       200:
 *         description: A stream of messages.
 */
messageRouter.get('/stream', async (req: Request, res: Response) => {
    const { groupId, streamEnabled } = req.query;

    if (streamEnabled === 'false') {
        return res.status(200).send({ message: 'Streaming is temporarily disabled' });
    }

    if (!groupId) {
        return res.status(400).send({ error: 'Group ID is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Adjust your client origin
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    let lastSentTimestamp = new Date().toISOString();

    const interval = setInterval(async () => {
        try {
            const messages = await messageService.getNewMessages(parseInt(groupId as string, 10), lastSentTimestamp);
            if (messages.length > 0) {
                lastSentTimestamp = messages[messages.length - 1].getTimestamp().toISOString();
                res.write(`data: ${JSON.stringify(messages)}\n\n`);
            }
        } catch (error) {
            console.error('Error streaming messages:', error);
        }
    }, 3000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});



/**
 * @swagger
 * /messages/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a message by ID.
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the message to retrieve
 *          schema:
 *            type: integer
 *     responses:
 *         200:
 *            description: The requested message.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Message'
 */
messageRouter.get('/:id', async (req, res) => {
  const messageId = parseInt(req.params.id, 10);
  console.log("THE MESSAGE ID ========= " + messageId)

  if (isNaN(messageId)) {
    console.error(`Invalid message ID received: ${req.params.id}`);
    return res.status(400).send({ error: 'Invalid message ID' });
  }

  try {
    console.log(`Fetching message by ID: ${messageId}`);
    const message = await messageService.getMessageById(messageId);

    if (!message) {
      return res.status(404).send({ error: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message by ID:', error);
    res.status(500).send({ error: 'Failed to fetch message' });
  }
});




export { messageRouter };
