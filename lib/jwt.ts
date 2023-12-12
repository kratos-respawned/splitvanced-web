import { EncryptJWT, base64url, jwtDecrypt } from "jose";
import { nanoid } from "nanoid";
type DecryptedJwtPayload<T> = {
  payload: T;
  iat: number;
  jti: string;
  exp: number;
};

export const encrypt = async <T extends Record<string, unknown>>(
  payload: T,
  secret: string
): Promise<string> => {
  const key = base64url.decode(secret);
  const jwt = await new EncryptJWT({
    payload,
  })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setJti(nanoid())
    .setExpirationTime("7D")
    .encrypt(key);
  return jwt;
};

export const decrypt = async <T extends Record<string, unknown>>(
  token: string,
  secret: string
): Promise<DecryptedJwtPayload<T>> => {
  const key = base64url.decode(secret);
  const payload = await jwtDecrypt(token, key);
  return payload.payload as DecryptedJwtPayload<T>;
};
