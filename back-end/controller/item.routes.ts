import express, { NextFunction, Request, Response } from 'express';
import itemService from '../service/item.service';
import { ItemInput } from '../types';

const itemRouter = express.Router();

/**
 * @swagger
 * /items:
 *   post:
 *     security:
 *        - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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
 *     security:
 *       - bearerAuth: []
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

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update an existing item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       200:
 *         description: The updated item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found.
 */
itemRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const itemData: ItemInput = req.body;
        const result = await itemService.updateItem(id, itemData);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete an item by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the item to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item deleted successfully.
 *       404:
 *         description: Item not found.
 */
itemRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await itemService.deleteItem(id);
        if (result) {
            res.status(200).json({ message: 'Item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        next(error);
    }
});

export { itemRouter };
