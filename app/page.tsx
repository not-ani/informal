"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Id } from "@/convex/_generated/dataModel";
import { New } from "./new";

export default function Home() {
  const forms = useQuery(api.forms.getUserForms, {});
  const deleteForm = useMutation(api.forms.deleteForm);
  const handleDelete = async (formId: Id<"forms">) => {
    try {
      await deleteForm({ formId });
    } catch (e) {
      alert(e);
    }
  };
  return (
    <>
      <header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-slate-200 dark:border-slate-800 flex flex-row justify-between items-center">
        <SignOutButton />
        <New />
      </header>
      <main className="p-8 flex flex-col gap-8">
        {forms && forms.length > 0 ? (
          <>
            <h2 className="mt-0">Your forms</h2>
            <Table>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form._id}>
                    <TableCell>
                      <a href={`/form/${form._id}/edit`}>{form._id}</a>
                    </TableCell>
                    <TableCell>{form.name}</TableCell>
                    <TableCell>{form.description}</TableCell>
                    <TableCell>
                      <span
                        onClick={() => handleDelete(form._id)}
                        className="delete-button"
                      ></span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <p>You don&apos;t have any forms yet. </p>
        )}
      </main>
    </>
  );
}

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-foreground rounded-md px-2 py-1"
          onClick={() =>
            void signOut().then(() => {
              router.push("/signin");
            })
          }
        >
          Sign out
        </button>
      )}
    </>
  );
}
