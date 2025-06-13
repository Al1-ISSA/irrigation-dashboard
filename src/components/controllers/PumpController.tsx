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
  volume: z.string().nonempty(),
});

export default function PumpController() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!data.volume) {
      toast.message("Irrigation", {
        description: "Please enter a volume",
      });
    }

    try {
      const irrigateRequest = axios.post("/api/pump", {
        pump: "on",
        volume: parseInt(data.volume),
      });

      toast.promise(irrigateRequest, {
        loading: "Please Wait",
        success: () => {
          return "Irrigation started successfully";
        },
        error: (err) => {
          if (err.response) {
            return err.response.data.error;
          }
          return "Failed to start irrigation";
        },
      });
    } catch (error) {
      console.error("Error sending request:", error);
      toast.message("Irrigation", {
        description: "Failed to start irrigation",
      });
    }
  }
  return (
    <fieldset className="grid gap-6 rounded-lg border p-4 w-96">
      <legend className="-ml-1 px-1 text-sm font-medium">
        Pump Controller
      </legend>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6">
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Volume</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a volume" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="10">10 ml</SelectItem>
                    <SelectItem value="20">20 ml</SelectItem>
                    <SelectItem value="30">30 ml</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Irrigate
          </Button>
        </form>
      </Form>
    </fieldset>
  );
}
