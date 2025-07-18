import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";

interface ResponsesEmptyStateProps {
  responsesCount: number;
}

export function ResponsesEmptyState({ responsesCount }: ResponsesEmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center text-muted-foreground">
          {(() => {
            const isEmpty = responsesCount === 0;
            const Icon = isEmpty ? Users : Search;
            const primary = isEmpty
              ? "No responses yet"
              : "No responses match your filters";
            const secondary = isEmpty
              ? "Responses will appear here when users submit the form"
              : "Try adjusting your search criteria";
            return (
              <div>
                <Icon
                  aria-hidden="true"
                  className="h-12 w-12 mx-auto mb-4 opacity-50"
                />
                <p>{primary}</p>
                <p className="text-sm">{secondary}</p>
              </div>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
} 