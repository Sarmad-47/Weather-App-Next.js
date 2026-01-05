import { Spinner } from "@/components/ui/spinner";

export default function LoadingPage() {
  return (
    <div className="grid h-svh w-full place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
