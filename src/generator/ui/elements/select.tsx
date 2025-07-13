import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FieldDef } from "../../lib";
import { Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function SelectField({ def, control }: { def: FieldDef; control: Control }) {
  return (
    <FormField
      key={def._id}
      control={control}
      name={def.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{def.name}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value ?? ""}
            >
              {def.options?.map((opt) => (
                <div key={opt} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt} id={`${def.name}-${opt}`} />
                  <label htmlFor={`${def.name}-${opt}`}>{opt}</label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default SelectField;
