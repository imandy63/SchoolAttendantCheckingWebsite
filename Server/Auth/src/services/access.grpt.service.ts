import { verifyJWT } from "../auth/authUtils";
import KeyTokenService from "./keyToken.service";

export const grpcVerification = async ({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) => {
  //1 input is not falsy
  if (!userId || !accessToken) {
    return { isValid: false, message: "Invalid Request!" };
  }

  //2 keyStore
  const keyStore = await KeyTokenService.findByUserId({
    userId: userId.toString(),
  });
  if (!keyStore || !keyStore.publicKey) {
    return { isValid: false, message: "Not found Key Store!" };
  }

  try {
    const decodeUser = verifyJWT(accessToken, keyStore.publicKey);
    if (decodeUser.userId != userId) {
      return { isValid: false, message: "Invalid User Id!" };
    }
    return { isValid: true, message: "Authenticated" };
  } catch (error) {
    return { isValid: false, message: "Unauthenticated!" };
  }
};
