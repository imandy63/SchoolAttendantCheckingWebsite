import { Obj } from "../interfaces";
import { StatusCodes, ReasonPhrases } from "../utils/httpStatusCode";
import { Request, Response } from "express";

interface CustomResponse {
  options?: object;
  message: string;
  statusCode?: number;
  reason?: string;
  metadata: Obj | Obj[] | null;
}

class SuccessResponse {
  options: object;
  message: string;
  statusCode: number;
  metadata: Obj | Obj[] | null;

  constructor({
    options = {},
    message,
    statusCode = StatusCodes.OK,
    reason = ReasonPhrases.OK,
    metadata,
  }: CustomResponse) {
    this.options = options;
    this.message = !message ? reason : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send = (res: Response, headers = {}) => {
    return res.status(this.statusCode).json(this);
  };
}

class OK extends SuccessResponse {
  constructor({ message, metadata }: CustomResponse) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    options,
    message = "",
    statusCode = StatusCodes.CREATED,
    reason = ReasonPhrases.CREATED,
    metadata,
  }: CustomResponse) {
    super({ options, message, statusCode, reason, metadata });
  }
}

export class NO_CONTENT extends SuccessResponse {
  constructor({
    options = {},
    message = "",
    statusCode = StatusCodes.CREATED,
    reason = ReasonPhrases.CREATED,
    metadata = null,
  }) {
    super({ options, message, statusCode, reason, metadata });
  }
}

export { OK, CREATED, SuccessResponse };
