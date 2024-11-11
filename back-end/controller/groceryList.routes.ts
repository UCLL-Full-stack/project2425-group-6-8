import express, { NextFunction, Request, Response } from 'express';
import groceryListService from '../service/groceryList.service';

const groceryListRouter = express.Router();

/**
 * @swagger
 * /grocerylists:
 *   get:
 *     summary: Get all grocery lists.
 *     responses:
 *       200:
 *         description: List of all grocery lists.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GroceryList'
 */
groceryListRouter.get('/', (req: Request, res: Response) => {
    const groceryLists = groceryListService.getAllGroceryLists();
    res.status(200).json(groceryLists);
});

/**
 * @swagger
 * /grocerylists/{id}/items:
 *   post:
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

    console.log('Grocery List ID:', groceryListId);
    console.log('Item IDs:', itemIds);

    try {
        const updatedGroceryList = groceryListService.addItemsToGroceryList(groceryListId, itemIds);
        res.status(200).json(updatedGroceryList);
    } catch (error) {
        console.error('Error:', error); 
        next(error);
    }
});

export { groceryListRouter };
