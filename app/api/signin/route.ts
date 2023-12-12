import { VerificationEmail } from "@/emails/verification-mail";
import { formatZodError } from "@/errors/zod-error";
import { db } from "@/lib/db";
import { env } from "@/lib/env.mjs";
import { APIErrorHandler } from "@/lib/error-handler";
import { decrypt, encrypt } from "@/lib/jwt";
import { resend } from "@/lib/resend";
import { MailJWTPayload } from "@/typings/email-types";
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
    return APIErrorHandler(e);
  }
}

const ResponseFromOldUserHandler = async (user: User, password: string) => {
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new Response(JSON.stringify("Invalid Password"), { status: 400 });
  }
  if (user.isVerified) {
    return new Response(JSON.stringify(user), { status: 400 });
  } else {
    return new Response(JSON.stringify("Please Verify Your Email"), {
      status: 400,
    });
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
    },
  });

  const token = await encrypt<MailJWTPayload>(
    { id: newUser.id },
    env.EMAIL_KEY
  );
  const mailResp = await resend.emails.send({
    from: "splitvanced@itsgaurav.co",
    to: [newUser.email],
    subject: "Verification Link",
    react: VerificationEmail({
      url: `http://localhost:3000/api/verify?token=${token}`,
    }),
  });
  if (mailResp.error) {
    console.log(mailResp.error);
    return new Response("Error Sending Mail", { status: 400 });
  }
  return new Response("Please check your mail for the verification link", {
    status: 200,
  });
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
