import { BadRequestError } from "../../core/error.response";
import { Participation_Status } from "../../enum/role.enum";
import { convertToObjectIdMongoose } from "../../utils";
import { students } from "../student.model";

export const participateInActivity = async ({
  student_id,
  activity_name,
  activity_id,
}: {
  student_id: string;
  activity_name: string;
  activity_id: string;
}) => {
  return await students.findOneAndUpdate(
    {
      student_id: student_id,
      student_participated_activities: {
        $not: {
          $elemMatch: {
            name: activity_name,
            status: Participation_Status.REGISTERED,
          },
        },
      },
    },
    {
      $addToSet: {
        student_participated_activities: {
          _id: convertToObjectIdMongoose(activity_id),
          name: activity_name,
          status: Participation_Status.REGISTERED,
        },
      },
    },
    { new: true }
  );
};

export const findStudentById = async (id: string) => {
  return await students
    .findOne(
      { _id: convertToObjectIdMongoose(id) },
      { student_id: 1, student_name: 1 }
    )
    .lean();
};
