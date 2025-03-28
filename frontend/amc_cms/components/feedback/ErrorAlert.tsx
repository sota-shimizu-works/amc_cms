"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type ErrorAlertProps = {
  message: string;
  title?: string;
};

export const ErrorAlert = ({
  message,
  title = "エラーが発生しました",
}: ErrorAlertProps) => {
  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto my-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
