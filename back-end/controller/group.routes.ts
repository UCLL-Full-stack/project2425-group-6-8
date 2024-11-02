import express, { NextFunction, Request, Response } from 'express';
import groupService from '../service/group.service';
import { GroupInput } from '../types';

const groupRouter = express.Router();

/**
 * @swagger
 * /groups:
 *   post:
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
 */
groupRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupData: GroupInput = {
            name: req.body.name,
            user: req.body.user, // Make sure the user is being sent in the request body
            groceryList: req.body.groceryList,
            schedule: req.body.schedule,
            message: req.body.message,
        };

        const result = await groupService.createGroup(groupData,);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /groups:
 *   get:
 *      summary: Retrieve all groups.
 *      responses:
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
        next(error);
    }
});

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *      summary: Retrieve a group by ID.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the group to retrieve
 *          schema:
 *            type: integer
 *      responses:
 *         200:
 *            description: The requested group.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Group'
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

export { groupRouter };
