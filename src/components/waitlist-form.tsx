"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { waitlistFormSchema, type WaitlistFormData } from "@/lib/validations/waitlist";
import { toast } from "sonner";
import NumberFlow from "@number-flow/react"; 

export const WaitlistForm = (props: { className?: string }) => {
  const { className } = props;
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const joinWaitlistMutation = useMutation(api.waitlist.joinWaitlist);
  const waitlistCount = useQuery(api.waitlist.getWaitlistCount);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistFormSchema),
  });

  const onSubmit = async (data: WaitlistFormData) => {
    try {
      await joinWaitlistMutation({ email: data.email });
      setIsSubmitted(true);
      reset();
      toast.success("Successfully joined the waitlist!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to join waitlist";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex flex-col gap-6 items-center justify-center w-full max-w-3xl mx-auto",
          className,
        )}
      >
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-xl font-semibold">
              You&apos;re on the waitlist! 🎉
            </p>
            <p className="text-base text-muted-foreground">
              We&apos;ll let you know when we&#39;re ready to show you what
              we&#39;ve been working on.
            </p>
          </div>
        ) : (
          <form
            className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex-1">
              <Input
                placeholder="example@email.com"
                className="md:text-base text-base font-medium h-11 placeholder:text-muted-foreground placeholder:font-medium bg-white outline outline-neutral-200 w-full rounded-md px-4"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button
              className="w-full sm:w-fit pl-4 pr-3 h-11 text-base"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Joining..." : "Join Waitlist"} 
              <ChevronRight className="h-5 w-5" />
            </Button>
          </form>
        )}

        <div className="relative flex flex-row gap-2 items-center justify-center">
          <span className="bg-green-600 dark:bg-green-400 size-2 rounded-full" />
          <span className="bg-green-600 dark:bg-green-400 size-2 rounded-full blur-xs left-0 absolute" />
          <span className="text-green-600 dark:text-green-400 text-sm sm:text-base">
            <NumberFlow value={waitlistCount ?? 0} /> people already joined
          </span>
        </div>
      </div>
    </div>
  );
};
