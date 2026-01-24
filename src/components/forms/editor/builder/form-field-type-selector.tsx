"use client";

import {
  AlignLeft,
  Check,
  CircleDot,
  Hash,
  Upload,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FieldType } from "./types";
import { FIELD_TYPES, fieldTypeLabels } from "./types";

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  text: <AlignLeft className="h-4 w-4" />,
  textarea: <AlignLeft className="h-4 w-4" />,
  number: <Hash className="h-4 w-4" />,
  select: <CircleDot className="h-4 w-4" />,
  multiselect: <Check className="h-4 w-4" />,
  file: <Upload className="h-4 w-4" />,
};

interface FormFieldTypeSelectorProps {
  value: FieldType;
  onChange: (value: FieldType) => void;
  disabled?: boolean;
}

export function FormFieldTypeSelector({
  value,
  onChange,
  disabled,
}: FormFieldTypeSelectorProps) {
  return (
    <Select
      disabled={disabled}
      onValueChange={(newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      value={value}
    >
      <SelectTrigger className="w-[160px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            {fieldTypeIcons[value]}
            <span>{fieldTypeLabels[value]}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {FIELD_TYPES.map((type) => (
          <SelectItem key={type} value={type}>
            <span className="flex items-center gap-2">
              {fieldTypeIcons[type]}
              <span>{fieldTypeLabels[type]}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
