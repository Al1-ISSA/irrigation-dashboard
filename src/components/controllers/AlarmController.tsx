"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

const FormSchema = z.object({
  state: z.string().nonempty(),
});

export default function AlarmController() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const motionRequest = axios.post("/api/motion", {
        motion: data.state,
      });

      toast.promise(motionRequest, {
        loading: "Please Wait",
        success: () => {
          return "Motion sensor state updated";
        },
        error: (err) => {
          if (err.response) {
            return err.response.data.error;
          }
          return "Failed to update motion sensor state";
        },
      });
    } catch (error) {
      console.error("Error sending request:", error);
      toast.message("Motion", {
        description: "Failed to update motion sensor state",
      });
    }
  }
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4 w-96">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Alarm Controller
      </legend>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alarm State</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="on">On</SelectItem>
                    <SelectItem value="off">Off</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </fieldset>
  );
}
