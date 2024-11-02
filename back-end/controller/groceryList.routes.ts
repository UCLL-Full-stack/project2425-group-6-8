/**
 * @swagger
 *   components:
 *     schemas:
 *       GroceryList:
 *         type: object
 *         properties:
 *           id:
 *             type: number
 *             format: int64
 *           name:
 *             type: string
 *           items:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Item'
 *           weight:
 *             type: number
 *             format: float
 *           quantity:
 *             type: number
 *             format: float
 *       GroceryListInput:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           items:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *                 name:
 *                   type: string
 *                 consumableType:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *           weight:
 *             type: number
 *             format: float
 *           quantity:
 *             type: number
 *             format: float
 */

import express, { NextFunction, Request, Response } from 'express';
import groceryListService from '../service/groceryList.service';
import { GroceryListInput } from '../types';

const groceryListRouter = express.Router();

/**
 * @swagger
 * /grocerylists:
 *   post:
 *     summary: Create a new grocery list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GroceryListInput'
 *     responses:
 *       200:
 *         description: The created grocery list.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroceryList'
 */
groceryListRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groceryListData = <GroceryListInput>req.body;
        const result = await groceryListService.addGroceryList(groceryListData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

export { groceryListRouter };
