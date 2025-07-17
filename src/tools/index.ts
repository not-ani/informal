import { getFormInfoTool } from "./getFormInfo";
import { createFieldTool } from "./createField";
import { updateFieldTool } from "./updateField";
import { deleteFieldTool } from "./deleteField";
import { deleteFormTool } from "./deleteForm";
import { updateForm } from "./updateForm";

export const getTools = (token: string) => ({
  getFormInfo: getFormInfoTool(token),
  createField: createFieldTool(token),
  updateField: updateFieldTool(token),
  deleteField: deleteFieldTool(token),
  deleteForm: deleteFormTool(token),
  updateForm: updateForm(token),
});

export {
  getFormInfoTool,
  createFieldTool,
  updateFieldTool,
  deleteFieldTool,
  deleteFormTool,
  updateForm,
}; 