/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           format: int64
 *           description: The unique identifier for the item.
 *         name:
 *           type: string
 *           description: The name of the item.
 *         description:
 *           type: string
 *           description: A brief description of the item.
 *         consumableType:
 *           type: string
 *           description: The type of consumable (e.g., perishable, non-perishable).
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the item.
 *     ItemInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item.
 *         description:
 *           type: string
 *           description: A brief description of the item.
 *         consumableType:
 *           type: string
 *           description: The type of consumable (e.g., perishable, non-perishable).
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the item.
 */

import express, { NextFunction, Request, Response } from 'express';
import itemService from '../service/item.service';
import { ItemInput } from '../types';

const itemRouter = express.Router();

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       200:
 *         description: The created item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
itemRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemData: ItemInput = req.body;
        const result = await itemService.createItem(itemData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Retrieve all items.
 *     responses:
 *       200:
 *         description: A list of items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
itemRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await itemService.getAllItems();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Retrieve an item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
itemRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await itemService.getItemById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        next(error);
    }
});

export { itemRouter };
