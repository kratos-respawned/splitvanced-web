"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { SignInValidator, signInValidator } from "@/validatiors/userschema";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignInResponseSchema } from "@/validatiors/signinResponse-schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Login() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<SignInValidator>({
    resolver: zodResolver(signInValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (creds: SignInValidator) => {
    const resp = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });
    const json = await resp.json();
    try {
      const data = SignInResponseSchema.parse(json);
      if (data.status === "authenticated") {
        toast({
          title: "Success",
          description: "You have been logged in",
        });
        router.push("/");
      } else if (data.status === "unauthenticated") {
        toast({
          variant: "destructive",
          title: "Error",
          description: data.error,
        });
      } else if (data.status === "unverified") {
        toast({
          title: "Verify your email",
          description: data.error,
        });
      }
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  };
  return (
    <main className=" min-h-screen grid place-items-center px-4">
      <Card className=" max-w-lg w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="alan.turing@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Something Secure" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
