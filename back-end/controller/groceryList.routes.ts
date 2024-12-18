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
 *@swagger
 * /put/grocerylists/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Edit a grocery list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grocery list to edit
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Weekly Shopping
 *               addItemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [101, 102]
 *               removeItemIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [103]
 *     responses:
 *       200:
 *         description: Updated grocery list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GroceryList'
 *       400:
 *         description: Error updating grocery list
 */

groceryListRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const groceryListId = parseInt(req.params.id, 10);
    const { name, addItemIds, removeItemIds } = req.body;

    try {
        const updatedGroceryList = await groceryListService.updateGroceryList(
            groceryListId,
            name,
            addItemIds,
            removeItemIds
        );
        res.status(200).json(updatedGroceryList);
    } catch (error) {
        console.error(`Error updating grocery list with ID ${groceryListId}:`, error);
        next(error);
    }
});

/**
 *@swagger
 * /delete/grocerylists/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Delete a grocery list
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the grocery list to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Grocery list deleted successfully
 *       400:
 *         description: Error deleting grocery list
 */

groceryListRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const groceryListId = parseInt(req.params.id, 10);

    try {
        await groceryListService.deleteGroceryList(groceryListId);
        res.status(204).send(); // No content
    } catch (error) {
        console.error(`Error deleting grocery list with ID ${groceryListId}:`, error);
        next(error);
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
 * /group/{groupId}:
 *   get:
 *     summary: Get all grocery lists for a specific group
 *     description: Fetch all grocery lists associated with a specific group ID.
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         description: The ID of the group to fetch the grocery lists for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of grocery lists for the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *       404:
 *         description: No grocery lists found for the group
 *       500:
 *         description: Internal server error
 */
groceryListRouter.get('/group/:groupId', async (req: Request, res: Response) => {
    const groupId = parseInt(req.params.groupId, 10); 
    try {
        const groceryLists = await groceryListService.getGroceryListsByGroupId(groupId); 
        if (!groceryLists || groceryLists.length === 0) {
            return res.status(404).json({ error: 'No grocery lists found for this group' });
        }
        res.status(200).json(groceryLists);
    } catch (error) {
        console.error(`Error fetching grocery lists for group ID ${groupId}:`, error);
        res.status(500).json({ error: 'Failed to fetch grocery lists' });
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
 *               groupId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the group the grocery list belongs to
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
    const { name, items, groupId } = req.body;

    console.log("Received request to create grocery list");
    console.log("Request body:", req.body); // Log the full request body for debugging

    if (!groupId) {
        console.warn("Missing groupId in request");
        return res.status(400).json({ error: 'groupId is required to create a grocery list' });
    }

    try {
        console.log("Calling createGroceryList service with the following parameters:");
        console.log("name:", name);
        console.log("items:", items);
        console.log("groupId:", groupId);

        const newGroceryList = await groceryListService.createGroceryList(name, items, groupId);

        console.log("Grocery list created successfully:", newGroceryList);

        res.status(201).json(newGroceryList);
    } catch (error) {
        console.error("Error creating grocery list:", error);
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
