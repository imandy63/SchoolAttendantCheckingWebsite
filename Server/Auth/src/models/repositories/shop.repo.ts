import { NumObj } from "../../interfaces";
import { shop } from "../shop.model";
export const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
}: {
  email: string;
  select?: NumObj;
}) => {
  return await shop.findOne({ email }).select(select).lean();
};
