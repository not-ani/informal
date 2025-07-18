"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Copy, 
  CheckCircle, 
  Wrench,
  Database,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fake tool invocation data
const fakeToolInvocations = [
  {
    id: 1,
    toolName: "database_query",
    state: "result" as const,
    result: {
      forms: [
        { id: "form_1", title: "Customer Feedback", responses: 127 },
        { id: "form_2", title: "Event Registration", responses: 89 },
        { id: "form_3", title: "Product Survey", responses: 234 }
      ],
      totalForms: 3,
      totalResponses: 450
    }
  },
  {
    id: 2,
    toolName: "search_files",
    state: "result" as const,
    result: {
      files: [
        { name: "form_config.json", size: "2.3KB", type: "configuration" },
        { name: "response_data.csv", size: "15.7KB", type: "data" },
        { name: "analytics_report.pdf", size: "1.2MB", type: "report" }
      ],
      totalFiles: 3,
      totalSize: "1.2MB"
    }
  }
];

// Get icon for specific tool types
function getToolIcon(toolName: string) {
  const name = toolName.toLowerCase();
  
  if (name.includes('database') || name.includes('db') || name.includes('query')) {
    return <Database className="h-4 w-4 text-primary" />;
  }
  if (name.includes('search') || name.includes('find')) {
    return <Search className="h-4 w-4 text-primary" />;
  }
  
  // Default wrench icon
  return <Wrench className="h-4 w-4 text-primary" />;
}

interface MarketingToolInvocationProps {
  toolInvocation: typeof fakeToolInvocations[0];
}

function MarketingToolInvocationDisplay({ toolInvocation }: MarketingToolInvocationProps) {
  const { toolName, result } = toolInvocation;
  const [isResultExpanded, setIsResultExpanded] = useState(false);

  const formatJSON = (obj: unknown) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="my-2"
    >
      <Card className="border-l-4 border-l-primary bg-muted/30 hover:shadow-md transition-all duration-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              {getToolIcon(toolName)}
              <span className="font-mono text-sm group-hover:text-primary transition-colors">
                {toolName}
              </span>
            </CardTitle>
            <Badge variant="secondary" className="bg-chart-1/20 text-chart-1 border-chart-1/30">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResultExpanded(!isResultExpanded)}
              className="h-auto p-2 justify-start w-full text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group-hover:bg-muted/30"
            >
              <motion.div
                animate={{ rotate: isResultExpanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3 mr-1" />
              </motion.div>
              View Result
            </Button>
            
            {isResultExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-chart-1/10 border border-chart-1/20 rounded-md p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-chart-1">Tool Result</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-chart-1/10"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words font-mono text-chart-1">
                  {formatJSON(result)}
                </pre>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function MarketingToolInvoke() {
  return (
    <div className="space-y-4 p-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">AI Tool Execution</h3>
        <p className="text-sm text-muted-foreground">
          Watch as AI tools execute in real-time, fetching data and processing information
        </p>
      </div>
      
      <div className="space-y-3">
        {fakeToolInvocations.map((invocation) => (
          <MarketingToolInvocationDisplay 
            key={invocation.id} 
            toolInvocation={invocation} 
          />
        ))}
      </div>
    </div>
  );
} 