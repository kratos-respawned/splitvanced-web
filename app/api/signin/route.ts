import { VerificationEmail } from "@/emails/verification-mail";
import { db } from "@/lib/db";
import { env } from "@/lib/env.mjs";
import { decrypt, encrypt } from "@/lib/jwt";
import { resend } from "@/lib/resend";
import { MailJWTPayload } from "@/typings/email-types";
import { signInValidator } from "@/validatiors/userschema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const reqJSON = await req.json();
    const { email, password } = signInValidator.parse(reqJSON);
    const user = await db.user.findUnique({ where: { email, password } });
    if (user && user.isVerified) {
      return new Response(JSON.stringify(user), { status: 200 });
    } else if (user && !user.isVerified) {
      return new Response(JSON.stringify("Please Verify your Email"), {
        status: 400,
      });
    }
    const newUser = await db.user.create({
      data: {
        email,
        password,
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
    return new Response(JSON.stringify("Please Check the Mail"), {
      status: 200,
    });
  } catch (e) {
    let error: string = "Something went wrong";
    if (e instanceof ZodError) {
      error = e.issues.map((issue) => issue.message).join("\n");
      return new Response(error, { status: 400 });
    }
    return new Response(JSON.stringify(e), { status: 400 });
  }
}

export async function GET(req: Request) {
  try {
    const data = await db.user.findMany();
    return Response.json(data);
  } catch (e) {
    return new Response(JSON.stringify(e), { status: 400 });
  }
}
