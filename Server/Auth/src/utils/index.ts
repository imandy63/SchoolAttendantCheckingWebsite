import * as _ from "lodash";
import { Types } from "mongoose";
import { Obj } from "../interfaces";
import * as JWT from "jsonwebtoken";
import { IPayload } from "../interfaces/auth";

const convertToObjectIdMongoose = (id: string) => {
  return new Types.ObjectId(id);
};

const getInfoData = ({
  fields = [],
  object = {},
}: {
  fields: string[];
  object: Obj;
}) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export {
  getUnSelectData,
  getSelectData,
  convertToObjectIdMongoose,
  getInfoData,
};
