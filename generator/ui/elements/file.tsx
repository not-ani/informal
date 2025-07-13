import { FC } from "react";
import { FieldDef } from "../../lib";
import { useUploadThing } from "@/lib/uploadthing";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

export const FileUploadField: FC<{
  def: FieldDef;
  control: Control;
}> = ({ def, control }) => {
  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => { },
    onUploadError: () => { },
  });

  return (
    <FormField
      control={control}
      name={def.name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{def.name}</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input
                type="file"
                accept=".pdf"
                onChange={async (e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    try {
                      const uploadedFiles = await startUpload(
                        Array.from(files),
                      );
                      if (uploadedFiles && uploadedFiles.length > 0) {
                        // Set the file URL in the form
                        field.onChange(uploadedFiles[0].url);
                      }
                    } catch (error) {
                      console.error("Upload failed:", error);
                    }
                  }
                }}
                disabled={isUploading}
              />
              {isUploading && (
                <div className="text-sm text-gray-500">Uploading...</div>
              )}
              {field.value && (
                <div className="text-sm text-green-600">
                  File uploaded: {field.value}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

