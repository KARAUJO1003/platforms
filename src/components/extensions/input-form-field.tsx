"use client";
import { ComponentProps } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type PropsForm = {
  name: string;
  label?: string;
  className?: string;
  inputClasses?: string;
  showMessageErrors?: boolean;
  mask?: (value: any) => void;
} & ComponentProps<"input">;

export const InputFormField = ({
  name,
  label,
  className,
  inputClasses,
  showMessageErrors = true,
  mask,
  ...rest
}: PropsForm) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      defaultValue={rest.defaultValue}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>
            <Input
              {...rest}
              id={name}
              type={rest.type}
              className={cn(inputClasses)}
              value={field.value ?? undefined}
              onChange={(e) => {
                if (mask) {
                  const maskedValue = mask(e.target.value);
                  field.onChange(maskedValue);
                  return;
                }
                field.onChange(e.target.value);
              }}
            />
          </FormControl>
          {showMessageErrors && <FormMessage />}
        </FormItem>
      )}
    />
  );
};
