/**
 * @swagger
 *   components:
 *    securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *    schemas:
 *      AuthenticationResponse:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Authentication response.
 *            token:
 *              type: string
 *              description: JWT access token.
 *            nickname:
 *              type: string
 *              description: User name.
 *            name:
 *             type: string
 *             description: Full name.
 *      AuthenticationRequest:
 *          type: object
 *          properties:
 *            nickname:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *      User:
 *          type: object
 *          properties:
 *            id:
 *              type: number
 *              format: int64
 *            name:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *            nickname:
 *              type: string
 *              description: Nickname of the user.
 *            email:
 *              type: string
 *              description: E-mail.
 *      UserInput:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *              description: User name.
 *            password:
 *              type: string
 *              description: User password.
 *            nickname:
 *              type: string
 *              description: Nickname of the user.
 *            email:
 *              type: string
 *              description: E-mail.
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
 *     security:
 *       - bearerAuth: []
 *     summary: Get a list of all users
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request , res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { nickname: string; password: string; } };
        const { nickname, password } = request.auth;
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
 *      summary: Create a user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserInput'
 *      responses:
 *         200:
 *            description: The created user object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/User'
 */
userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const user = await userService.createUser(userInput);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *      summary: Login using username/password. Returns an object with JWT token and user name when succesful.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AuthenticationRequest'
 *      responses:
 *         200:
 *            description: The created user object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AuthenticationResponse'
 */
userRouter.post(
    '/login',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { nickname, password } = req.body as UserInput;

            if (!nickname || !password) {
                return res.status(400).json({ message: 'Username and password are required.' });
            }

            // Call the authenticate method from the service layer
            const authResponse = await userService.authenticate({ nickname, password });

            // Send the response to the client
            res.status(200).json(authResponse);
        } catch (error) {
            next(error);
        }
    }
);

export { userRouter };
