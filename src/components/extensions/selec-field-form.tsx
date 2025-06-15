import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface SelectFieldFormProps {
  name: string;
  label?: string;
  options: { [key: string]: any }[] | string[]; // Aceita array de objetos ou strings
  optionLabel?: string;
  optionValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClasses?: string;
}

export const SelectFieldForm = ({
  name,
  label,
  options,
  optionLabel = "label",
  optionValue = "value",
  placeholder,
  disabled = false,
  triggerClasses,
  className,
}: SelectFieldFormProps) => {
  const { control, setValue, watch } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(["w-full"], className)}>
          {label && <FormLabel className="text-end">{label}</FormLabel>}
          <FormControl>
            <Select
              {...field}
              disabled={disabled}
              value={field.value}
              onValueChange={(e) => {
                if (e) {
                  setValue(name, e);
                } else {
                  setValue(name, watch(name));
                }
              }}
            >
              <SelectTrigger
                className={cn(
                  ["col-span-3 bg-background w-full"],
                  triggerClasses
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(options) &&
                options.length > 0 &&
                typeof options[0] === "string"
                  ? // Se `options` for um array de strings
                    options.map((option: any, index: number) => (
                      <SelectItem
                        key={String(new Date().getTime() + index)}
                        value={String(option)}
                      >
                        {String(option)}
                      </SelectItem>
                    ))
                  : // Se `options` for um array de objetos
                    options.map((option: any, index: number) => (
                      <SelectItem
                        key={String(new Date().getTime() + index)}
                        value={option[optionValue]}
                      >
                        {option[optionLabel]}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};
