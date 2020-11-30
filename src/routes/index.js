import express from 'express';

import userRoutes from './users';

const router = express.Router();

router.use('/user', userRoutes);

module.exports = router;
