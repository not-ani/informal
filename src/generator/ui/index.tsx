import { FC } from "react";
import { UseFormReturn } from "react-hook-form";

import { FieldDef } from "../lib";
import { FileUploadField } from "./elements/file";
import { TextareaField } from "./elements/textarea";
import SelectField from "./elements/select";
import { CheckboxField } from "./elements/checkbox";
import { DateField } from "./elements/date-field";
import { InputField } from "./elements/input";
import { MCQField } from "./elements/mcq";

const renderField = (def: FieldDef, form: UseFormReturn<any>) => {
  const { control } = form;

  if (def.type === "text" || def.type === "number") {
    return <InputField def={def} control={control} />;
  }

  if (def.type === "textarea") {
    return <TextareaField def={def} control={control} />;
  }

  if (def.type === "file") {
    return <FileUploadField key={def._id} def={def} control={control} />;
  }

  if (def.type === "mcq") {
    return <MCQField def={def} control={control} />;
  }

  if (def.type === "checkbox") {
    return <CheckboxField def={def} control={control} />;
  }

  if (def.type === "select") {
    return <SelectField def={def} control={control} />;
  }

  if (def.type === "date") {
    return <DateField def={def} control={control} />;
  }

  if (def.type === "time") {
    return <div>TimeField</div>;
  }

  return (
    <p key={def._id} className="text-red-600">
      Unknown field type: {def.type}
    </p>
  );
};

export const DynamicFormFields: FC<{
  fields: FieldDef[];
  form: UseFormReturn<any>;
}> = ({ fields, form }) => <>{fields.map((def) => renderField(def, form))}</>;
