import { FormControl, FormMessage, FormItem, FormLabel, FormField } from "@/components/ui/form";
import { FieldDef } from "../../lib";
import { Control } from "react-hook-form";

export function CheckboxField({ def, control }: { def: FieldDef; control: Control }) {
    return (
      <FormField
        key={def._id}
        control={control}
        name={def.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{def.name}</FormLabel>
            <FormControl>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );

}