"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { groupSchema } from "@/validatiors/group-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { revalidatePath } from "next/cache";
import { useToast } from "@/components/ui/use-toast";
import { Loader, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateGroupForm() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">New Group</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Enter the name of the group you want to create. Click save when
              you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">New Group</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Group</DrawerTitle>
          <DrawerDescription>
            Enter the name of the group you want to create. Click save when
            you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<groupSchema>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (data: groupSchema) => {
    try {
      const resp = await fetch("/api/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const json = await resp.json();
      if (json.status === "success") {
        toast({
          title: "Success",
          description: "Group created",
        });
        router.refresh();
      } else {
        throw new Error(json.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          typeof error === "object" &&
          "message" in error! &&
          typeof error.message === "string"
            ? error.message
            : "Something went wrong",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid items-start gap-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  list="autocompleteOff"
                  placeholder="Vacation 2023"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting || form.formState.isLoading}
          type="submit"
        >
          {form.formState.isSubmitting || form.formState.isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>Save changes</>
          )}
        </Button>
      </form>
    </Form>
  );
}
