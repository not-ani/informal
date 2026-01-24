import { FormProvider } from "@/components/forms/context";
import { PermissionWrapper } from "./edit/permission-wrapper";
import { Navbar } from "./navbar";
import type { Id } from "@convex/_generated/dataModel";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}) {
  const id = (await params).id;
  return (
    <FormProvider formId={id as Id<"forms">}>
      <PermissionWrapper formId={id} requiredPermission="view">
        <div className="h-screen overflow-hidden">
          <Navbar />
          {children}
        </div>
      </PermissionWrapper>
    </FormProvider>
  );
}
