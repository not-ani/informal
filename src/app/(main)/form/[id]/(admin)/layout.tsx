import { FormContextProvider } from "./form-context";
import { Navbar } from "./navbar";

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
    <FormContextProvider id={id}>
      <Navbar />
      {children}
    </FormContextProvider>
  );
}
