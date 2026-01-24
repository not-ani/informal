/* eslint-disable react/no-children-prop */
/** biome-ignore-all lint/correctness/noChildrenProp: <explanation> */
"use client";

import { useCallback, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GitBranch,
  GripVertical,
  Plus,
  Trash,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@convex/_generated/dataModel";
import { api } from "@convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { FieldCondition, FormField, FormSection } from "./types";
import { ConditionEditor } from "./condition-editor";
import { FormQuestionCard } from "./form-question-card";

interface SectionCardProps {
  section: FormSection;
  fields: FormField[];
  allFields: FormField[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeFieldId: Id<"formFields"> | null;
  onActivateField: (fieldId: Id<"formFields">) => void;
  onDeleteField: (fieldId: Id<"formFields">) => void;
  onDuplicateField: (field: FormField) => void;
  onAddField: (sectionId: Id<"formSections">) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function SectionCard({
  section,
  fields,
  allFields,
  isExpanded,
  onToggleExpand,
  activeFieldId,
  onActivateField,
  onDeleteField,
  onDuplicateField,
  onAddField,
  dragHandleProps,
}: SectionCardProps) {
  const updateSection = useMutation(api.sections.update);
  const deleteSection = useMutation(api.sections.remove);
  const clearCondition = useMutation(
    api.sections.clearCondition,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showConditionEditor, setShowConditionEditor] = useState(
    !!section.condition,
  );
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm({
    defaultValues: {
      title: section.title,
      description: section.description ?? "",
    },
  });

  const saveSection = useCallback(
    async (values: { title: string; description: string }) => {
      setIsSaving(true);
      try {
        await updateSection({
          sectionId: section._id,
          formId: section.formId,
          title: values.title,
          description: values.description,
        });
      } catch {
        toast.error("Failed to save section");
      } finally {
        setIsSaving(false);
      }
    },
    [section._id, section.formId, updateSection],
  );

  const debouncedSave = useCallback(
    (values: { title: string; description: string }) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        void saveSection(values);
      }, 500);
    },
    [saveSection],
  );

  const handleConditionChange = useCallback(
    async (condition: FieldCondition | undefined) => {
      if (!condition) {
        try {
          await clearCondition({ sectionId: section._id, formId: section.formId });
          setShowConditionEditor(false);
        } catch {
          toast.error("Failed to clear condition");
        }
      } else {
        try {
          await updateSection({
            sectionId: section._id,
            formId: section.formId,
            condition,
          });
        } catch {
          toast.error("Failed to update condition");
        }
      }
    },
    [section._id, section.formId, updateSection, clearCondition],
  );

  const handleDelete = useCallback(async () => {
    if (fields.length > 0) {
      toast.error(
        "Cannot delete section with questions. Move or delete questions first.",
      );
      return;
    }
    try {
      await deleteSection({ sectionId: section._id, formId: section.formId });
      toast.success("Section deleted");
    } catch {
      toast.error("Failed to delete section");
    }
  }, [section._id, section.formId, fields.length, deleteSection]);

  const availableSourceFields = allFields.filter(
    (f) =>
      (f.type === "select" || f.type === "multiselect") &&
      f.sectionId !== section._id &&
      f.formId === section.formId &&
      f.order < (fields[0]?.order ?? Infinity),
  );

  return (
    <div className="bg-card rounded-lg border">
      <Collapsible open={isExpanded} onOpenChange={onToggleExpand}>
        <div className="group flex items-center gap-2 p-4">
          <div
            {...dragHandleProps}
            className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
          >
            <GripVertical className="text-muted-foreground h-5 w-5" />
          </div>
          <Button
            aria-label="Move section down"
            variant={"ghost"}
            className={
              "cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
            }
            size={"icon"}
            onClick={() => {
              void updateSection({
                sectionId: section._id,
                formId: section.formId,
                order: section.order - 1,
              });
            }}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            aria-label="Move section up"
            variant={"ghost"}
            size={"icon"}
            className="cursor-grab opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => {
              void updateSection({
                sectionId: section._id,
                formId: section.formId,
                order: section.order + 1,
              });
            }}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <CollapsibleTrigger
            asChild
          >
            <Button variant="ghost" size="icon-sm">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>

          <div className="flex-1">
            <form.Field
              name="title"
              children={(fieldApi) => (
                <Input
                  className={cn(
                    "focus-visible:border-primary rounded-none border-0 border-b px-0 font-semibold focus-visible:ring-0",
                  )}
                  value={fieldApi.state.value}
                  onChange={(e) => {
                    fieldApi.handleChange(e.target.value);
                    debouncedSave({
                      ...form.state.values,
                      title: e.target.value,
                    });
                  }}
                  placeholder="Section Title"
                />
              )}
            />
          </div>

          {isSaving && (
            <span className="text-muted-foreground text-xs">Saving...</span>
          )}

          {section.condition && (
            <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
              Conditional
            </span>
          )}

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setShowConditionEditor(!showConditionEditor)}
            title="Add condition"
            className={cn(showConditionEditor && "text-primary")}
          >
            <GitBranch className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
            title="Delete section"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        {showConditionEditor && (
          <div className="border-t px-4 py-3">
            {section.condition && (
              <ConditionEditor
                condition={section.condition}
                availableFields={availableSourceFields}
                onChange={handleConditionChange}
              />
            )}
          </div>
        )}

        <CollapsibleContent>
          <div className="space-y-4 px-4 pb-4">
            <form.Field
              name="description"
              children={(fieldApi) => (
                <Field>
                  <Input
                    className="text-muted-foreground text-sm"
                    value={fieldApi.state.value}
                    onChange={(e) => {
                      fieldApi.handleChange(e.target.value);
                      debouncedSave({
                        ...form.state.values,
                        description: e.target.value,
                      });
                    }}
                    placeholder="Section description (optional)"
                  />
                </Field>
              )}
            />

            {fields.length === 0 ? (
              <div className="text-muted-foreground rounded-md border border-dashed py-8 text-center">
                <p className="mb-2 text-sm">No questions in this section</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddField(section._id)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {fields.map((field) => (
                  <FormQuestionCard
                    key={field._id}
                    field={field}
                    isActive={activeFieldId === field._id}
                    onActivate={() => onActivateField(field._id)}
                    onDelete={() => onDeleteField(field._id)}
                    onDuplicate={() => onDuplicateField(field)}
                  />
                ))}
              </div>
            )}

            <Button
              className="text-muted-foreground hover:border-primary hover:text-foreground w-full border-2 border-dashed"
              onClick={() => onAddField(section._id)}
              variant="ghost"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
