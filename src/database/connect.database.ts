import mongoose from 'mongoose';
import Logger from '../logger';
import { config } from '../../config';

mongoose.set('strictQuery', false);

export default function DB_Connect(): Promise<void>{ 
    return new Promise((resolve) => {
        mongoose
        .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
        .then(() => {
            Logger.success(`Connected to the database called ${config.mongo.username}.`)  
            Logger.beautifulSpace()
            resolve();
        })
        .catch(() => {
            Logger.fatal("Failed to connect to the database, exiting... ");
            Logger.warn("Please check your database configuration in the environment file (.env)")
            process.exit(1);
        });
    })
}