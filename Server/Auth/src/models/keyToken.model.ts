import { InferSchemaType, Schema, model } from "mongoose";

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";

var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "modified_at",
    },
  }
);

export const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema);
export type KeyTokenPayload = InferSchemaType<typeof keyTokenSchema>;
export type IKeyStore = {
  _id: string;
  refreshToken: string;
  publicKey: string;
  refreshTokensUsed: string[];
  createdAt: Date;
  updatedAt: Date;
};
