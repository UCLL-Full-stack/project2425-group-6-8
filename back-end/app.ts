import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { groceryListRouter }  from './controller/groceryList.routes';
import { groupRouter }  from './controller/group.routes';
import { itemRouter }  from './controller/item.routes';
import { messageRouter }  from './controller/message.routes';
import { scheduleRouter }  from './controller/schedule.routes';
import { userRouter }  from './controller/user.routes';

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Back-end is running...' });
});

app.use('/groceryLists', groceryListRouter);
app.use('/groups', groupRouter);
app.use('/items', itemRouter);
app.use('/messages', messageRouter);
app.use('/schedules', scheduleRouter);
app.use('/users', userRouter);


app.listen(port, () => {
    console.log(`Back-end is running on port ${port}.`);
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GroceryList API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));