// app/api/register/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../../lib/prisma';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../../firebase';

// Define the schema for the request payload
const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3, 'Name must be at least 3 characters long').max(50, 'Name is too long'),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(20, 'Password is too long'),
});

// Type for the parsed request data
type UserData = z.infer<typeof UserSchema>;

export async function POST(request: Request) {
  try {
    // Parse and validate the incoming request data using Zod
    const body: UserData = await request.json();
    UserSchema.parse(body);

    const createUserPromise = createUserWithEmailAndPassword(
      auth,
      body.email,
      body.password
    );

    // Create the user in the database if validation succeeds
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
      },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error creating user: ', error);
    
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    // Handle other unexpected errors
    return NextResponse.json({ error: 'Unable to create user' }, { status: 500 });
  }
}
