import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldDef } from "../../lib";
import { Control } from "react-hook-form";

export function InputField({
  def,
  control,
}: {
  def: FieldDef;
  control: Control;
}) {
  const inputType = def.type === "number" ? "number" : def.type;

  return (
    <FormField
      key={def._id}
      control={control}
      name={def.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{def.name}</FormLabel>
          <FormControl>
            <Input type={inputType} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
