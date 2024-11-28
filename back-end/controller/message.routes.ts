/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: The unique identifier for the message.
 *         message:
 *           type: string
 *           description: The content of the message.
 *         userId:
 *           type: number
 *           format: int64
 *           description: The ID of the user who sent the message.
 *         groupId:
 *           type: number
 *           format: int64
 *           description: The ID of the group to which the message belongs.
 *     MessageInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *           format: int64
 *           description: The ID of the user who is sending the message.
 *         groupId:
 *           type: number
 *           format: int64
 *           description: The ID of the group to which the message will be sent.
 */



import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';
import { MessageInput } from '../types';
import { User } from '../model';

const messageRouter = express.Router();

/**
 * @swagger
 * /messages:
 *   post:
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
 *      summary: Retrieve all messages.
 *      responses:
 *         200:
 *            description: A list of messages.
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Message'
 */
messageRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.getAllMessages();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/{id}:
 *   get:
 *      summary: Retrieve a message by ID.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the message to retrieve
 *          schema:
 *            type: integer
 *      responses:
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
