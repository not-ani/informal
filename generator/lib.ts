import { Id } from "@/convex/_generated/dataModel";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
import { z, ZodTypeAny } from 'zod';

export type FieldDef = {
  _id: Id<"form_fields">;
  name: string;
  type:
  | 'text'
  | 'textarea'
  | 'select'
  | 'number'
  | 'date'
  | 'time'
  | 'mcq'
  | 'checkbox'
  | 'file'
  ;
  required?: boolean;
  options?: string[];
  default?: unknown;
};

/**
 * Turns a list of FieldDef objects into:
 *   { formSchema, defaultValues, nameToId }
 */
export function buildFormSchema(fields: FieldDef[]) {
  const shape: Record<string, ZodTypeAny> = {};
  const defaults: Record<string, unknown> = {};
  const nameToId: Record<string, Id<"form_fields">> = {};
  fields.forEach((field) => {
    let t: ZodTypeAny;

    switch (field.type) {
      case 'number':
        // react-hook-form gives you strings, preprocess to number
        t = z.preprocess(
          (val) => {
            if (val === '' || val === null || val === undefined) {
              return undefined;
            }
            const num = Number(val);
            return isNaN(num) ? val : num; // Return original value if it's not a valid number, let zod handle the error
          },
          field.required ? z.number() : z.number().optional()
        );
        break;

      case 'file':
        t = z
          .string()
          .url('Invalid file URL');
        break;

      case 'textarea':
      case 'text':
        t = field.required ? z.string().min(1, 'This field is required') : z.string();
        break;

      case 'mcq':
        t = field.options?.length
          ? z.enum([...field.options] as [string, ...string[]])
          : z.string();
        break;

      default:
        t = z.any();
    }

    if (field.type !== 'number') {
      t = field.required ? t : t.optional();
    }

    shape[field.name] = t;
    defaults[field.name] =
      field.default ??
      (field.type === 'number'
        ? undefined
        : field.type === 'mcq'
          ? ''
          : '');
    nameToId[field.name] = field._id;
  });

  return { formSchema: z.object(shape), defaultValues: defaults, nameToId };
}
