import express from "express";
const router = express.Router();
import { getAllJobs, createJob,updateJob,deleteJob } from "../controllers/JobController.js";

router.get('/', getAllJobs);
router.post('/', createJob);
router.put('/:jobId', updateJob);
router.delete('/:jobId', deleteJob);



export default router;