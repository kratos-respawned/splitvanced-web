import { VerificationEmail } from "@/emails/verification-mail";
import { formatZodError } from "@/errors/zod-error";
import { db } from "@/lib/db";
import { env } from "@/lib/env.mjs";
import { APIErrorHandler } from "@/lib/error-handler";
import { decrypt, encrypt } from "@/lib/jwt";
import { resend } from "@/lib/resend";
import { JWTPayload } from "@/typings/email-types";
import { SignInResponse } from "@/validatiors/signinResponse-schema";
import { signInValidator } from "@/validatiors/userschema";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const reqJSON = await req.json();
    const { email, password } = signInValidator.parse(reqJSON);
    const user = await db.user.findUnique({ where: { email } });
    if (user) return ResponseFromOldUserHandler(user, password);
    else return ResponseFromNewUserHandler(email, password);
  } catch (e) {
    let resp: SignInResponse;
    const errMessage = APIErrorHandler(e);

    return SignedResponse("unauthenticated", undefined, errMessage);
  }
}

const ResponseFromOldUserHandler = async (user: User, password: string) => {
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return SignedResponse("unauthenticated", undefined, "Invalid password");
  }
  if (user.isVerified) {
    const token = await encrypt<JWTPayload>({ id: user.id }, env.SECRET_KEY);
    return SignedResponse("authenticated", user, undefined, token);
  } else {
    return SignedResponse("unverified", undefined, "Please verify your email");
  }
};

const ResponseFromNewUserHandler = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name: email.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: true,
    },
  });

  const token = await encrypt<JWTPayload>({ id: newUser.id }, env.EMAIL_KEY);
  // const mailResp = await resend.emails.send({
  //   from: "splitvanced@itsgaurav.co",
  //   to: [newUser.email],
  //   subject: "Verification Link",
  //   react: VerificationEmail({
  //     url: `http://localhost:3000/api/verify?token=${token}`,
  //   }),
  // });
  // if (mailResp.error) {
  //   console.log(mailResp.error);
  //   return SignedResponse("unauthenticated", undefined, "Something went wrong");
  // }
  return SignedResponse("unverified", undefined, "Please verify your email");
};

// ONly for testing
export async function GET(req: Request) {
  try {
    const data = await db.user.findMany({});
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify(e), { status: 400 });
  }
}

const SignedResponse = (
  status: "unverified" | "authenticated" | "unauthenticated",
  user?: User,
  error?: string,
  token?: string
) => {
  let resp: SignInResponse = {
    status: "unauthenticated",
    error: "Something went wrong",
  };
  let code: 200 | 500 = 500;
  if (status === "authenticated" && user && token) {
    resp = {
      status: "authenticated",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: String(user.createdAt),
        updatedAt: String(user.updatedAt),
      },
    };
    code = 200;
  } else if (status === "unauthenticated" && error) {
    resp = {
      status: "unauthenticated",
      error,
    };
    code = 200;
  } else if (status === "unverified" && error) {
    resp = {
      status: "unverified",
      error,
    };
    code = 200;
  }
  return Response.json(resp, {
    status: code,
    headers: token
      ? {
          "Set-Cookie": `token=${token}; path=/; HttpOnly; Max-Age=${
            60 * 60 * 24 * 7
          }`,
          // for future use
          // Authorization: `Bearer ${token}`,
        }
      : {},
  });
};
