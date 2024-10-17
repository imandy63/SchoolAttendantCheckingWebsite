import mongoose from "mongoose";

const COLLECTION_NAME = "ActivityTracking";
const DOCUMENT_NAME = "ActivityTracking";

const ActivityTrackingSchema = new mongoose.Schema({
  activity_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['JOINED', 'ABSENT'], required: true },
  participation_date: { type: Date, default: Date.now },
  activity_score: { type: Number },
  notes: { type: String }
});

