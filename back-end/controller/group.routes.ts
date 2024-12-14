/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *         name:
 *           type: string
 *           description: The name of the group.
 *         users:
 *           type: array
 *           items:
 *             type: integer
 *             description: User IDs that are part of the group.
 *         groceryList:
 *           type: array
 *           items:
 *             type: integer
 *             description: IDs of grocery lists associated with the group.
 *         schedule:
 *           type: array
 *           items:
 *             type: integer
 *             description: IDs of schedules associated with the group.
 *         message:
 *           type: array
 *           items:
 *             type: integer
 *             description: IDs of messages associated with the group.
 *     GroupInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the group.
 *         users:
 *           type: array
 *           items:
 *             type: integer
 *             description: User IDs that are to be added to the group.
 *         groceryList:
 *           type: array
 *           items:
 *             type: integer
 *             description: IDs of grocery lists to be associated with the group.
 *         schedule:
 *           type: array
 *           items:
 *             type: integer
 *             description: IDs of schedules to be associated with the group.
 *         message:
 *           type: array
 *           items:
 *             type: integer
 *             description: IDs of messages to be associated with the group.
 *     ItemInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the item.
 *         name:
 *           type: string
 *           description: The name of the item.
 *         description:
 *           type: string
 *           description: A description of the item.
 *         consumableType:
 *           type: string
 *           enum:
 *             - FOOD
 *             - NON_FOOD
 *           description: The type of consumable (e.g., FOOD, NON_FOOD).
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the item.
 *         weight:
 *           type: number
 *           format: float
 *           description: The weight of the item (optional).
 *         quantity:
 *           type: number
 *           format: integer
 *           description: The quantity of the item (optional).
 *     GroceryListInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the grocery list.
 *         name:
 *           type: string
 *           description: The name of the grocery list.
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemInput'
 *           description: A list of items in the grocery list.
 *     ScheduleInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the schedule.
 *         name:
 *           type: string
 *           description: The name of the schedule.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date of the schedule.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date of the schedule.
 *     MessageInput:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the message.
 *         user:
 *           $ref: '#/components/schemas/UserInput'
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the message was sent.
 *         message:
 *           type: string
 *           description: The content of the message.
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         nickname:
 *           type: string
 *           description: The nickname of the user.
 */

import express, { NextFunction, Request, Response } from 'express';
import groupService from '../service/group.service';
import { GroupInput } from '../types';

const groupRouter = express.Router();

/**
 * @swagger
 * /groups:
 *   post:
 *      security:
 *        - bearerAuth: []
 *      summary: Create a new group.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GroupInput'
 *      responses:
 *         200:
 *            description: The created group.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Group'
 *         400:
 *            description: Bad request due to missing or invalid group data.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 */
groupRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupData = {
            name: req.body.name,
            userIds: req.body.users, 
            groceryList: req.body.groceryList,
            schedule: req.body.schedule,
            message: req.body.message,
        };

        const result = await groupService.createGroup(groupData);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in group creation:', error);
        next(error);
    }
});


/**
 * @swagger
 * /groups:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all groups.
 *     responses:
 *         200:
 *            description: A list of groups.
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Group'
 */
groupRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    console.log("GET /groups - Request received"); // Log route hit
    try {
        const result = await groupService.getAllGroups();
        console.log("GET /groups - Result:", JSON.stringify(result, null, 2)); // Log result
        res.status(200).json(result);
    } catch (error) {
        console.error("GET /groups - Error:", error); // Log error
        next(error);
    }
});

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a group by ID.
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the group to retrieve
 *          schema:
 *            type: integer
 *     responses:
 *         200:
 *            description: The requested group.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Group'
 *         404:
 *            description: Group not found.
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 */
groupRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await groupService.getGroupById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /groups/{id}/users:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Add a user to an existing group.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the group to which the user will be added.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user to add to the group.
 *     responses:
 *       200:
 *         description: User successfully added to the group.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Group or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request due to invalid or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
groupRouter.post('/:id/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupId = parseInt(req.params.id, 10);
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const result = await groupService.addUserToGroup(groupId, userId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Group or user not found.' });
        }
    } catch (error) {
        next(error);
    }
});


export { groupRouter };
