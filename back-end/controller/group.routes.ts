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
 *             type: string
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
 *         isCompleted:
 *           type: boolean
 *           format: boolean
 *           description: The state of an item, completed or not
 *     GroceryListInput:
 *       type: object
 *       properties:
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
import itemService from '../service/item.service';  
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
            nicknames: req.body.users, 
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
    try {
        const result = await groupService.getAllGroups();
        res.status(200).json(result);
    } catch (error) {
        console.error("GET /groups - Error:", error); 
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
 * /groups/{userId}/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve groups of a user.
 *     parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: ID of the user to retrieve the groups he is in.
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
groupRouter.get('/:userId/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.userId, 10);
        const result = await groupService.getGroupsOfUser(id);
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
 * /groups/{groupId}/items:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all items within a specific group.
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The group ID for which you want to fetch items.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of items belonging to the group.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       404:
 *         description: No items found for this group.
 *       400:
 *         description: Invalid group ID.
 */
groupRouter.get('/:groupId/items', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        
        // Validate groupId
        if (!groupId || groupId <= 0) {
            return res.status(400).json({ message: 'Invalid group ID.' });
        }

        // Call the service to fech items related to the group
        const items = await itemService.getItemsByGroupId(groupId);

        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found for this group.' });
        }

        // Send back the items
        res.status(200).json(items);
    } catch (error) {
        next(error); // Forward error to the error handler
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

/**
 * @swagger
 * /groups/{id}/users:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Remove a user from an existing group.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the group from which the user will be removed.
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
 *                 description: ID of the user to remove from the group.
 *     responses:
 *       200:
 *         description: User successfully removed from the group.
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
groupRouter.delete('/:id/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupId = parseInt(req.params.id, 10);
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const result = await groupService.removeUserFromGroup(groupId, userId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Group or user not found.' });
        }
    } catch (error) {
        next(error);
    }
});



/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a group by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the group to delete.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Group successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Group successfully deleted"
 *       400:
 *         description: Invalid group ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid group ID"
 *       404:
 *         description: Group not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Group with ID {groupId} does not exist"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to delete the group"
 */

groupRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
        const id = parseInt(req.params.id, 10);
        const result = await groupService.deleteGroup(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        next(error);
    }
});



export { groupRouter };
