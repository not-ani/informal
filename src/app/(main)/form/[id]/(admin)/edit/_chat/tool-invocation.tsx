"use client";

import React, { useState } from "react";
import { type ToolInvocation } from "ai";
import { motion } from "framer-motion";
import { 
  ChevronDown, 
  Copy, 
  Loader2, 
  CheckCircle, 
  Wrench,
  AlertCircle,
  Database,
  Globe,
  FileText,
  Search,
  Send,
  Settings,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

// Get icon for specific tool types
function getToolIcon(toolName: string) {
  const name = toolName.toLowerCase();
  
  if (name.includes('database') || name.includes('db') || name.includes('query')) {
    return <Database className="h-4 w-4 text-primary" />;
  }
  if (name.includes('search') || name.includes('find')) {
    return <Search className="h-4 w-4 text-primary" />;
  }
  if (name.includes('file') || name.includes('read') || name.includes('write')) {
    return <FileText className="h-4 w-4 text-primary" />;
  }
  if (name.includes('api') || name.includes('http') || name.includes('fetch')) {
    return <Globe className="h-4 w-4 text-primary" />;
  }
  if (name.includes('send') || name.includes('message') || name.includes('email')) {
    return <Send className="h-4 w-4 text-primary" />;
  }
  if (name.includes('config') || name.includes('setting')) {
    return <Settings className="h-4 w-4 text-primary" />;
  }
  if (name.includes('execute') || name.includes('run') || name.includes('process')) {
    return <Zap className="h-4 w-4 text-primary" />;
  }
  
  // Default wrench icon
  return <Wrench className="h-4 w-4 text-primary" />;
}

export function ToolInvocationDisplay({ toolInvocation }: ToolInvocationDisplayProps) {
  const { toolName, state } = toolInvocation;
  const [isResultExpanded, setIsResultExpanded] = useState(false);
  const [startTime] = useState(Date.now());

  // Calculate execution time for completed tools
  const getExecutionTime = () => {
    if (state === "result") {
      const endTime = Date.now();
      const duration = endTime - startTime;
      if (duration < 1000) {
        return `${duration}ms`;
      } else {
        return `${(duration / 1000).toFixed(1)}s`;
      }
    }
    return null;
  };

  const getStatusIcon = () => {
    switch (state) {
      case "partial-call":
      case "call":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "result":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    const executionTime = getExecutionTime();
    
    switch (state) {
      case "partial-call":
      case "call":
        return (
          <Badge variant="secondary" className="bg-chart-3/20 text-chart-3 border-chart-3/30">
            {getStatusIcon()}
            Running
          </Badge>
        );
      case "result":
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-chart-1/20 text-chart-1 border-chart-1/30">
              {getStatusIcon()}
              Complete
            </Badge>
            {executionTime && (
              <Badge variant="outline" className="text-xs">
                {executionTime}
              </Badge>
            )}
          </div>
        );
      default:
        return (
          <Badge variant="outline">
            {getStatusIcon()}
            Unknown
          </Badge>
        );
    }
  };

  const formatJSON = (obj: unknown) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return String(obj);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const hasResult = state === "result" && "result" in toolInvocation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="my-2"
    >
      <motion.div
        animate={
          state === "call" || state === "partial-call"
            ? { scale: [1, 1.01, 1] }
            : {}
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Card className="border-l-4 border-l-primary bg-muted/30 hover:shadow-md transition-all duration-200 group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <motion.div
                  animate={
                    state === "call" || state === "partial-call"
                      ? { rotate: 360 }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  {getToolIcon(toolName)}
                </motion.div>
                <span className="font-mono text-sm group-hover:text-primary transition-colors">
                  {toolName}
                </span>
              </CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {/* Result Section - Only show if there's a result */}
            {hasResult && (
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
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(formatJSON(toolInvocation.result))}
                          className="h-6 w-6 p-0 hover:bg-chart-1/10"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                    <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-words font-mono text-chart-1">
                      {formatJSON(toolInvocation.result)}
                    </pre>
                  </motion.div>
                )}
              </div>
            )}

            {/* Loading state message */}
            {(state === "call" || state === "partial-call") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="h-1 w-1 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="h-1 w-1 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="h-1 w-1 bg-primary rounded-full"
                  />
                </div>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Executing tool...
                </motion.span>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
