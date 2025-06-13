"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { redirect } from "next/navigation";
import Link from "next/link";

const SignInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

type SignInInputs = z.infer<typeof SignInSchema>;

export default function SigninForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInputs>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = (data: SignInInputs) => {
    const signInPromise = signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    });

    toast.promise(signInPromise, {
      loading: "Signing in...",
      success: () => {
        router.push("/dashboard");
        return "You have successfully signed in!";
      },
      error: "Wrong username or password",
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors.email?.message}
          />
          <AuthInput
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors.password?.message}
          />
          <AuthButton>Sign in</AuthButton>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
