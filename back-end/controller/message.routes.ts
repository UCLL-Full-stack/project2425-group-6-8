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
        const { groupId } = req.query;  // Get groupId from query parameters
        
        let result;
        if (groupId) {
            result = await messageService.getAllMessages(parseInt(groupId as string, 10));
        } else {
            result = await messageService.getAllMessages(); // Get all if no groupId
        }

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
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
messageRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await messageService.getMessageById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Message not found' });
        }
    } catch (error) {
        next(error);
    }
});

export { messageRouter };
