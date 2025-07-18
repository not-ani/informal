'use client';

import { Authenticated, Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HomeProps {
  preloaded: Preloaded<typeof api.collaborators.getUserAccessibleForms>;
}

export default function Home({ preloaded }: HomeProps) {
  const userForms = usePreloadedQuery(preloaded);

  const router = useRouter();
  const createForm = useMutation(api.forms.create);
  const [prompt, setPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim() || isCreating) return;

    try {
      setIsCreating(true);
      const newFormId = await createForm();
      if (!newFormId) throw new Error("Failed to create form");

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(`newFormPrompt-${newFormId}`, prompt);
        } catch {
        }
      }

      router.push(`/form/${newFormId}/edit`);

      setPrompt("");
    } catch (e) {
      console.error(e);
      alert("Failed to create form. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Authenticated>
      <div className="min-h-screen flex flex-col items-center bg-background">
        <main className="container mx-auto px-4 py-54 ">
          <div className="max-w-3xl mx-auto mb-12">
            <div className="text-center mb-6">
              <h2 className="text-5xl font-bold mb-2">Create a new form with AI</h2>
              <p className="text-muted-foreground">
                Describe what kind of form you need, and our AI will generate it for you
              </p>
            </div>

            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Example: Create a customer satisfaction survey for a restaurant with questions about food quality, service, ambiance, and overall experience..."
                className="min-h-[120px] pr-16 text-base resize-none border rounded-2xl"
              />
              <Button
                size="sm"
                disabled={!prompt.trim() || isCreating}
                onClick={handleSubmit}
                className="absolute bottom-3 right-3"
              >
                <Send className="h-4 w-4 mr-2" />
                {isCreating ? "Creating..." : "Generate"}
              </Button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Projects</h3>
              <Button variant="outline" size="sm" onClick={() => router.push("/projects")}>View All</Button>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              {userForms.length > 0 ? (
                userForms.slice(0, 5).map((form) => (
                  <div key={form._id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{form.name}</p>
                        <Badge 
                          variant={form.userRole === "owner" ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {form.userRole}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {form.description}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => router.push(`/form/${form._id}/${form.userRole === "viewer" ? "" : "edit"}`)}
                    >
                      {form.userRole === "viewer" ? "View" : "Open"}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No forms available. Create a new form or wait for collaboration invites.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </Authenticated>
  );
} 
