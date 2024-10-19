import { NumObj } from "../../interfaces";
import { students } from "../auth.model";
export const findByStudentId = async ({
  student_id,
  select = {
    student_id: 1,
    password: 2,
    student_name: 1,
    roles: 1,
  },
}: {
  student_id: string;
  select?: NumObj;
}) => {
  return await students.findOne({ student_id }).select(select).lean();
};
