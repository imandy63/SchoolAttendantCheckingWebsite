import { NumObj } from "../../interfaces";
import { students } from "../auth.model";

export const findByStudentId = async ({
  student_id,
  select = {
    _id: 1,
    student_id: 1,
    password: 1, // Ensuring password is set to 1, not 2
    student_name: 1,
    role: 1,
  },
}: {
  student_id: string;
  select?: NumObj;
}) => {
  try {
    console.log('Finding user with student_id:', student_id);
    console.log('Using select:', select);

    // Check MongoDB connection and provide detailed status information
    if (!students.db.readyState) {
      console.error('MongoDB connection is not ready. ReadyState:', students.db.readyState);
      console.error('Connection details:', {
        uri: process.env.MONGODB_URI,
        host: process.env.MONGODB_HOST,
        port: process.env.MONGODB_PORT,
        database: process.env.MONGODB_DATABASE_NAME
      });
      throw new Error('Database connection is not ready. Please check MongoDB connection settings.');
    }

    // Trim and normalize student_id
    const normalizedStudentId = student_id.trim();
    console.log('Normalized student_id:', normalizedStudentId);

    // First try exact match
    const user = await students.findOne({ student_id: normalizedStudentId }).select(select).lean();
    console.log('Exact match result:', JSON.stringify(user, null, 2));

    if (!user) {
      console.log('No exact match found, trying case-insensitive search...');
      // Try case-insensitive query
      const userCaseInsensitive = await students
        .findOne({ student_id: normalizedStudentId })
        .collation({ locale: 'en', strength: 2 })
        .select(select)
        .lean();
      console.log('Case-insensitive query result:', JSON.stringify(userCaseInsensitive, null, 2));

      if (!userCaseInsensitive) {
        console.log('No user found with student_id:', normalizedStudentId);
        // Try to find any similar matches for debugging
        const similarMatches = await students
          .find({ student_id: { $regex: normalizedStudentId, $options: 'i' } })
          .select('student_id')
          .lean();
        console.log('Similar matches found:', JSON.stringify(similarMatches, null, 2));
        console.log('Current MongoDB connection string:', process.env.MONGODB_URI);
        
        // Log total number of documents in collection
        const totalDocs = await students.countDocuments();
        console.log('Total documents in Students collection:', totalDocs);
      }

      return userCaseInsensitive;
    }

    return user;
  } catch (error) {
    console.error('Error in findByStudentId:', error);
    throw error;
  }
};

