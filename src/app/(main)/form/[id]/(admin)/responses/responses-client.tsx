"use client";

import { usePreloadedQuery } from "convex/react";
import { Preloaded } from "convex/react";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Users } from "lucide-react";

interface ResponsesPageClientProps {
  formId: Id<"forms">;
  preloadedResponses: Preloaded<typeof api.form_responses.getDetailedFormResponses>;
  preloadedForm: Preloaded<typeof api.forms.get>;
  preloadedFields: Preloaded<typeof api.form_fields.getFormFields>;
}

export function ResponsesPageClient({
  preloadedResponses,
  preloadedForm,
  preloadedFields,
}: ResponsesPageClientProps) {
  const responses = usePreloadedQuery(preloadedResponses);
  const form = usePreloadedQuery(preloadedForm);
  const fields = usePreloadedQuery(preloadedFields);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string>("all");
  const [fieldValueFilter, setFieldValueFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Get unique field values for the selected field
  const fieldValues = useMemo(() => {
    if (selectedField === "all" || selectedField === "userEmail") return [];
    
    const values = new Set<string>();
    responses.forEach((response) => {
      response.fieldResponses.forEach((fieldResponse) => {
        if (fieldResponse.fieldId === selectedField) {
          if (Array.isArray(fieldResponse.response)) {
            fieldResponse.response.forEach(val => values.add(val));
          } else {
            values.add(fieldResponse.response);
          }
        }
      });
    });
    
    return Array.from(values).filter(Boolean).sort();
  }, [responses, selectedField]);

  // Filter responses based on all active filters
  const filteredResponses = useMemo(() => {
    return responses.filter((response) => {
      // Search query filter (searches across all field responses and email)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesEmail = response.userEmail?.toLowerCase().includes(searchLower);
        const matchesField = response.fieldResponses.some((fieldResponse) => {
          const responseText = Array.isArray(fieldResponse.response) 
            ? fieldResponse.response.join(", ").toLowerCase()
            : fieldResponse.response.toLowerCase();
          return responseText.includes(searchLower) || 
                 fieldResponse.fieldName.toLowerCase().includes(searchLower);
        });
        
        if (!matchesEmail && !matchesField) return false;
      }

      // Field-specific filter
      if (selectedField !== "all" && fieldValueFilter) {
        if (selectedField === "userEmail") {
          if (!response.userEmail?.toLowerCase().includes(fieldValueFilter.toLowerCase())) {
            return false;
          }
        } else {
          const hasMatchingField = response.fieldResponses.some((fieldResponse) => {
            if (fieldResponse.fieldId !== selectedField) return false;
            
            if (Array.isArray(fieldResponse.response)) {
              return fieldResponse.response.some(val => 
                val.toLowerCase().includes(fieldValueFilter.toLowerCase())
              );
            } else {
              return fieldResponse.response.toLowerCase().includes(fieldValueFilter.toLowerCase());
            }
          });
          
          if (!hasMatchingField) return false;
        }
      }

      // Date filter
      if (dateFilter !== "all") {
        const responseDate = new Date(response._creationTime);
        const now = new Date();
        
        switch (dateFilter) {
          case "today":
            if (responseDate.toDateString() !== now.toDateString()) return false;
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (responseDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (responseDate < monthAgo) return false;
            break;
        }
      }

      return true;
    });
  }, [responses, searchQuery, selectedField, fieldValueFilter, dateFilter]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedField("all");
    setFieldValueFilter("");
    setDateFilter("all");
  };

  const exportToCSV = () => {
    if (filteredResponses.length === 0) return;
    
    // Create headers
    const headers = ["Response ID", "User Email", "Submitted At"];
    fields.forEach(field => headers.push(field.name));
    
    // Create rows
    const rows = filteredResponses.map(response => {
      const row = [
        response._id,
        response.userEmail || "Anonymous",
        format(new Date(response._creationTime), "yyyy-MM-dd HH:mm:ss")
      ];
      
      // Add field responses in order
      fields.forEach(field => {
        const fieldResponse = response.fieldResponses.find(fr => fr.fieldId === field._id);
        if (fieldResponse) {
          const responseText = Array.isArray(fieldResponse.response) 
            ? fieldResponse.response.join("; ")
            : fieldResponse.response;
          row.push(responseText);
        } else {
          row.push("");
        }
      });
      
      return row;
    });
    
    // Create CSV content
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n");
    
    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form?.name || "form"}-responses-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 container mx-auto" >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Form Responses</h1>
          <p className="text-muted-foreground">
            {form?.name || "Untitled Form"} • {filteredResponses.length} of {responses.length} responses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {responses.length} Total
          </Badge>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search responses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Field Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Field</label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  <SelectItem value="userEmail">User Email</SelectItem>
                  {fields.map((field) => (
                    <SelectItem key={field._id} value={field._id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Field Value Filter */}
            {selectedField !== "all" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Value</label>
                {selectedField === "userEmail" ? (
                  <Input
                    placeholder="Email contains..."
                    value={fieldValueFilter}
                    onChange={(e) => setFieldValueFilter(e.target.value)}
                  />
                ) : fieldValues.length > 0 ? (
                  <Select value={fieldValueFilter} onValueChange={setFieldValueFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Values</SelectItem>
                      {fieldValues.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Value contains..."
                    value={fieldValueFilter}
                    onChange={(e) => setFieldValueFilter(e.target.value)}
                  />
                )}
              </div>
            )}

            {/* Date Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedField !== "all" || fieldValueFilter || dateFilter !== "all") && (
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responses Table */}
      {filteredResponses.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              {responses.length === 0 ? (
                <div>
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No responses yet</p>
                  <p className="text-sm">Responses will appear here when users submit the form</p>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No responses match your filters</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
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
                {filteredResponses.map((response) => (
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
        </Card>
      )}
    </div>
  );
} 