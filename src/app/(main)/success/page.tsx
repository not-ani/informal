import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          {/* Success Icon */}
          <div className="relative">
            <Image
              src="/success.svg"
              alt="Success"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Successfully Submitted!
            </h1>
            <p className="text-muted-foreground">
              Your form has been successfully submitted. We&apos;ll get back to
              you soon.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            <p></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
