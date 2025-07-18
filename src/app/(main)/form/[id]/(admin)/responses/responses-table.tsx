import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React from "react";

interface Field {
  _id: string;
  name: string;
  type: string;
}

interface FieldResponse {
  fieldId: string;
  fieldName: string;
  response: string | string[];
}

interface Response {
  _id: string;
  userEmail?: string;
  _creationTime: number;
  fieldResponses: FieldResponse[];
}

interface ResponsesTableProps {
  responses: Response[];
  fields: Field[];
}

export function ResponsesTable({ responses, fields }: ResponsesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[100px]">User</TableHead>
            <TableHead className="min-w-[120px]">Submitted</TableHead>
            {fields.map((field) => (
              <TableHead key={field._id} className="min-w-[150px]">
                {field.name}
                <Badge variant="outline" className="ml-2 text-xs">
                  {field.type}
                </Badge>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responses.map((response) => (
            <TableRow key={response._id}>
              <TableCell className="font-medium">
                {response.userEmail || (
                  <span className="text-muted-foreground italic">Anonymous</span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {format(new Date(response._creationTime), "MMM d, yyyy")}
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(response._creationTime), "h:mm a")}
                  </div>
                </div>
              </TableCell>
              {fields.map((field) => {
                const fieldResponse = response.fieldResponses.find(
                  (fr) => fr.fieldId === field._id
                );
                return (
                  <TableCell key={field._id}>
                    {fieldResponse ? (
                      Array.isArray(fieldResponse.response) ? (
                        <div className="space-y-1">
                          {fieldResponse.response.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="mr-1">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="max-w-[200px] truncate" title={fieldResponse.response}>
                          {fieldResponse.response}
                        </div>
                      )
                    ) : (
                      <span className="text-muted-foreground italic">No response</span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 