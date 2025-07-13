import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { SelectTrigger } from "@/components/ui/select";
import { SelectValue } from "@/components/ui/select";
import { SelectContent } from "@/components/ui/select";
import { SelectItem } from "@/components/ui/select";
import { FieldDef } from "../../lib";
import { Control } from "react-hook-form";

export function MCQField({ def, control }: { def: FieldDef; control: Control }) {
    return (
      <FormField
        key={def._id}
        control={control}
        name={def.name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{def.name}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {def.options?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );

}