import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service'; // Adjust the import based on your file structure
import { UserInput } from '../types'; // Adjust the import based on your file structure

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *      summary: Create a new user.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *         200:
 *            description: The created user.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: UserInput = req.body;
        const result = await userService.createUser(userData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users:
 *   get:
 *      summary: Retrieve all users.
 *      responses:
 *         200:
 *            description: A list of users.
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *      summary: Retrieve a user by ID.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the user to retrieve
 *          schema:
 *            type: integer
 *      responses:
 *         200:
 *            description: The requested user.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await userService.getUserById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
});

export { userRouter };
