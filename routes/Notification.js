import express from 'express';
import { createNotification, deleteNotification, getAllNotification, markNotificationAsRead } from '../controllers/Notification.js';
const routerNotification = express.Router();


routerNotification.get(('/'), getAllNotification)
routerNotification.delete(('/delete/:id'), deleteNotification)
routerNotification.post(('/add'), createNotification)
routerNotification.put(('/as-read/:id'), markNotificationAsRead)


export default routerNotification