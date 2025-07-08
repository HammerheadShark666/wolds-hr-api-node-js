import { Router } from 'express';
import type { RxDatabase, RxCollection } from 'rxdb'; 

export function createAuthenticationRouter(db: RxDatabase) {
  const router = Router();

//   let idCounter = 0;

//   router.post('/', async (req, res) => {
//     try {
//       const task = req.body.task;
//       const nextId = (idCounter + 1).toString();
//       const responseTask = await db.tasks.insert({ id: nextId, task: task, completed: false });
//       idCounter++;
//       res.status(201).json(responseTask);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         console.error('Error message:', err.message);
//         res.status(400).json({ error: err.message });
//       } else {
//         console.error('Unknown error', err);
//         res.status(500).json({ error: 'Unknown error' });
//       }
//     }
//   });

//   router.get('/', async (_req, res) => {
//     const tasks = await db.tasks.find().exec();
//     res.json(tasks);
//   });

//   router.get('/:id', async (req, res) => {
//     const id = req.params.id.toString();
//     const queryResult = await db.tasks.findOne({ selector: { id } }).exec();

//     if (queryResult !== null) {
//       res.status(200).json(queryResult);
//     } else {
//       res.status(404).json({ message: 'Task not found' });
//     }
//   });

  return router;
}
