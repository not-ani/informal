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
import { Filter, Search } from "lucide-react";
import React from "react";


interface FiltersPanelProps {
  filterObject: FilterObject;
  setFilterObject: (v: FilterObject) => void;
  
  fields: { _id: string; name: string }[];
  fieldValues: string[];
}

export type FilterObject = {
  search: string;
  field: string;
  fieldValue: string;
  date: string;
};

export function FiltersPanel({
  filterObject,
  setFilterObject,
  fields,
  fieldValues,
}: FiltersPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search responses..."
                value={filterObject.search}
                onChange={(e) => setFilterObject({ ...filterObject, search: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Filter by Field</label>
            <Select value={filterObject.field} onValueChange={(v) => setFilterObject({ ...filterObject, field: v })}>
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

          {filterObject.field !== "all" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Value</label>
              {filterObject.field === "userEmail" ? (
                <Input
                  placeholder="Email contains..."
                  value={filterObject.fieldValue}
                  onChange={(e) => setFilterObject({ ...filterObject, fieldValue: e.target.value })}
                />
              ) : fieldValues.length > 0 ? (
                <Select value={filterObject.fieldValue} onValueChange={(v) => setFilterObject({ ...filterObject, fieldValue: v })}>
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
                  value={filterObject.fieldValue}
                  onChange={(e) => setFilterObject({ ...filterObject, fieldValue: e.target.value })}
                />
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Select value={filterObject.date} onValueChange={(v) => setFilterObject({ ...filterObject, date: v })}>
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

        {(filterObject.search || filterObject.field !== "all" || filterObject.fieldValue || filterObject.date !== "all") && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => setFilterObject({ search: "", field: "all", fieldValue: "", date: "all" })}>
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 