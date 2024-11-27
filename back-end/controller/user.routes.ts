/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         nickname:
 *           type: string
 *           description: The nickname of the user.
 *     
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 *         nickname:
 *           type: string
 *           description: The nickname of the user.
 */

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service'; 
import { UserInput } from '../types'; 

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


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               nickname:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - nickname
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already exists.
 */


userRouter.post(
    '/register',
    async (req: Request, res: Response, next: NextFunction) => {
        try {   
            // Parse the input
            const userInput: UserInput = req.body;

            // Call the service to create a new user
            const newUser = await userService.createUser(userInput);

            // Respond with the newly created user (excluding the password)
            res.status(201).json({
                id: newUser.getId(),
                name: newUser.getName(),
                nickname: newUser.getNickname(),
                email: newUser.getEmail(),
                password: newUser.getPassword()
            });
        } catch (error) {
            next(error);
        }
    }
);

export { userRouter };
