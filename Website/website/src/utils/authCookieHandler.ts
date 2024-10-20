import Cookies from "js-cookie";

export const SetAuthCookie = (
  tokens: { accessToken: string; refreshToken: string },
  user: { _id: string }
) => {
  const accessTokenExpiry = 1;
  const refreshTokenExpiry = 3;

  Cookies.set("accessToken", tokens.accessToken, {
    expires: accessTokenExpiry / 24,
  });
  Cookies.set("refreshToken", tokens.refreshToken, {
    expires: refreshTokenExpiry,
  });
  Cookies.set("clientId", user._id, { expires: refreshTokenExpiry });
};

export const RemoveAuthCookie = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("clientId");
};
