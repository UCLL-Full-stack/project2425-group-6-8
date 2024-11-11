import express, { NextFunction, Request, Response } from 'express';
import groceryListService from '../service/groceryList.service';
import { ItemInput } from '../types';


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
 *     summary: Add items to an existing grocery list.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grocery list to add items to.
 *         schema:
 *           type: integer
 *       - in: body
 *         name: items
 *         description: List of items to add to the grocery list.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemInput'
 *     responses:
 *       200:
 *         description: Updated grocery list with new items.
 *       400:
 *         description: Error adding items.
 */

groceryListRouter.post('/:id/items', (req: Request, res: Response, next: NextFunction) => {
    const groceryListId = parseInt(req.params.id, 10);
    const items: ItemInput[] = req.body.items;

    console.log('Grocery List ID:', groceryListId);
    console.log('Items:', items);

    try {
        const updatedGroceryList = groceryListService.addItemsToGroceryList(groceryListId, items);
        res.status(200).json(updatedGroceryList);
    } catch (error) {
        console.error('Error:', error); 
        next(error);
    }
});




export { groceryListRouter };
