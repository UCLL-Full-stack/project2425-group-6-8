/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       properties:    
 *         name:
 *           type: string
 *           description: The name of the scheduled event.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the scheduled event (ISO 8601 format).
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the scheduled event (ISO 8601 format).
 *     ScheduleInput:
 *       type: object
 *       required:
 *         - name
 *         - startDate
 *         - endDate
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the scheduled event.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the scheduled event (ISO 8601 format).
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the scheduled event (ISO 8601 format).
 */


import express, { NextFunction, Request, Response } from 'express';
import scheduleService from '../service/schedule.service';
import { ScheduleInput } from '../types';

const scheduleRouter = express.Router();

/**
 * @swagger
 * /schedules:
 *   post:
 *      security:
 *        - bearerAuth: []
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
        const { name, startDate, endDate } = req.body;

        const scheduleData: ScheduleInput = {
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };

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
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve all schedules.
 *     responses:
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
 *     security:
 *       - bearerAuth: []
 *     summary: Retrieve a schedule by ID.
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: ID of the schedule to retrieve
 *          schema:
 *            type: integer
 *     responses:
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
