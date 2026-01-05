"use client";

import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-svh place-items-center bg-background px-4">
      <Card className="w-full max-w-lg rounded-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>

          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>
            The page you’re looking for doesn’t exist or may have been moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>

            {/* <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
