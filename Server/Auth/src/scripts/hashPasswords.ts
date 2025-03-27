import { students } from "../models/auth.model";
import bcrypt from "bcryptjs";

const hashPasswords = async () => {
  try {
    // Lấy tất cả user có password chưa được hash
    const users = await students.find({
      password: { $regex: /^[0-9a-zA-Z]+$/ } // Tìm password chỉ chứa chữ và số
    });

    console.log(`Found ${users.length} users with unhashed passwords`);

    for (const user of users) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Update password trong database
      await students.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );

      console.log(`Updated password for user ${user.student_id}`);
    }

    console.log('Password hashing completed successfully');
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
};

// Chạy script
hashPasswords();