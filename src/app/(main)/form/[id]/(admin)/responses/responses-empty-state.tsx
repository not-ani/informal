import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import React from "react";

interface ResponsesEmptyStateProps {
  responsesCount: number;
}

export function ResponsesEmptyState({ responsesCount }: ResponsesEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center text-muted-foreground">
          {responsesCount === 0 ? (
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
  );
} 