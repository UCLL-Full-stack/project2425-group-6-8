import express, { Request, Response, NextFunction } from 'express';
import groceryListService from '../service/groceryList.service';

const groceryListRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GroceryList:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Weekly Shopping
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Item'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-11-01T12:00:00.000Z"
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 101
 *         name:
 *           type: string
 *           example: Bread
 *         description:
 *           type: string
 *           example: Whole-grain bread loaf
 *         consumableType:
 *           type: string
 *           example: Food
 *         price:
 *           type: number
 *           example: 2.99
 */

/**
 * @swagger
 * /grocerylists:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get all grocery lists
 *     responses:
 *       200:
 *         description: List of all grocery lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroceryList'
 */
groceryListRouter.get('/', async (req: Request, res: Response) => {
    try {
        const groceryLists = await groceryListService.getAllGroceryLists();
        res.status(200).json(groceryLists);
    } catch (error) {
        console.error('Error fetching grocery lists:', error);
        res.status(500).json({ error: 'Failed to fetch grocery lists' });
    }
});

/**
 * @swagger
 * /grocerylists/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get a grocery list by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grocery list to fetch
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested grocery list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroceryList'
 *       404:
 *         description: Grocery list not found
 */
groceryListRouter.get('/:id', async (req: Request, res: Response) => {
    const groceryListId = parseInt(req.params.id, 10);
    try {
        const groceryList = await groceryListService.getGroceryListById(groceryListId);
        if (!groceryList) {
            return res.status(404).json({ error: 'Grocery list not found' });
        }
        res.status(200).json(groceryList);
    } catch (error) {
        console.error(`Error fetching grocery list with ID ${groceryListId}:`, error);
        res.status(500).json({ error: 'Failed to fetch grocery list' });
    }
});

/**
 * @swagger
 * /grocerylists:
 *   post:
 *     security:
 *        - bearerAuth: []
 *     summary: Create a new grocery list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Weekly Shopping
 *               items:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of item IDs to include in the grocery list
 *     responses:
 *       201:
 *         description: Grocery list created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroceryList'
 *       400:
 *         description: Validation error
 */
groceryListRouter.post('/', async (req: Request, res: Response) => {
    const { name, items } = req.body;
    try {
        const newGroceryList = await groceryListService.createGroceryList(name, items);
        res.status(201).json(newGroceryList);
    } catch (error) {
        console.error('Error creating grocery list:', error);
        res.status(400).json({ error: 'Failed to create grocery list' });
    }
});

/**
 * @swagger
 * /grocerylists/{id}/items:
 *   post:
 *     security:
 *       - bearerAuth: []  # Add this security definition
 *     summary: Add existing items to an existing grocery list by their IDs.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grocery list to add items to.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of item IDs to add to the grocery list.
 *     responses:
 *       200:
 *         description: Updated grocery list with added items.
 *       400:
 *         description: Error adding items.
 */
groceryListRouter.post('/:id/items', (req: Request, res: Response, next: NextFunction) => {
    const groceryListId = parseInt(req.params.id, 10);
    const { itemIds } = req.body;

    try {
        const updatedGroceryList = groceryListService.addItemsToGroceryList(groceryListId, itemIds);
        res.status(200).json(updatedGroceryList);
    } catch (error) {
        console.error('Error:', error); 
        next(error);
    }
});

export { groceryListRouter };
