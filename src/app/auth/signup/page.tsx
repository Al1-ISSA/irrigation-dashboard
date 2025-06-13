
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInput from "../../../components/auth/AuthInput";
import AuthButton from "../../../components/auth/AuthButton";
import { toast } from "sonner";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Link from "next/link";
import SignupForm from "../../../components/auth/SignupForm";

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

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <SignupForm />;  

}
