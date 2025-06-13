"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { redirect } from "next/navigation";
import Link from "next/link";

const SignUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" })
      .max(50, { message: "Name is too long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password is too long" }),
    passwordAgain: z.string(),
  })
  .refine((data) => data.password === data.passwordAgain, {
    message: "Passwords do not match",
    path: ["passwordAgain"],
  });

type SignUpInputs = z.infer<typeof SignUpSchema>;

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = ({ fullName, email, password }: SignUpInputs) => {
    const createUserPromise = axios.post("/api/register", {
      name: fullName,
      email: email,
      password: password,
    });

    toast.promise(createUserPromise, {
      loading: "Registering...",
      success: () => {
        router.push("/auth/signin");
        return "You have successfully registered!";
      },
      error: (err) => {
        if (err.response) {
          return err.response.data.error;
        }
        return "Registration failed";
      },
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
          Sign up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            id="fullName"
            label="Full name"
            type="text"
            register={register}
            errors={errors.fullName?.message}
          />
          <AuthInput
            id="email"
            label="Email address"
            type="email"
            register={register}
            errors={errors.email?.message}
          />
          <div className="flex justify-between gap-2">
            <AuthInput
              id="password"
              label="Password"
              type="password"
              register={register}
              errors={errors.password?.message}
            />
            <AuthInput
              id="passwordAgain"
              label="Confirm Password"
              type="password"
              register={register}
              errors={errors.passwordAgain?.message}
            />
          </div>
          <AuthButton>Sign Up</AuthButton>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Already a member?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
