import express, { NextFunction, Request, Response } from 'express';
import scheduleService from '../service/schedule.service'; // Adjust the import based on your file structure
import { ScheduleInput } from '../types'; // Adjust the import based on your file structure

const scheduleRouter = express.Router();

/**
 * @swagger
 * /schedules:
 *   post:
 *      summary: Create a new schedule.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ScheduleInput'
 *      responses:
 *         200:
 *            description: The created schedule.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Schedule'
 */
scheduleRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const scheduleData: ScheduleInput = req.body;
        const result = await scheduleService.createSchedule(scheduleData);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules:
 *   get:
 *      summary: Retrieve all schedules.
 *      responses:
 *         200:
 *            description: A list of schedules.
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Schedule'
 */
scheduleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await scheduleService.getAllSchedules();
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *      summary: Retrieve a schedule by ID.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the schedule to retrieve
 *          schema:
 *            type: integer
 *      responses:
 *         200:
 *            description: The requested schedule.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/Schedule'
 */
scheduleRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id, 10);
        const result = await scheduleService.getScheduleById(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        next(error);
    }
});

export { scheduleRouter };
