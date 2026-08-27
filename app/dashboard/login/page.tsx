import { Button } from "@/components/ui/button";
import { login } from "@/app/dashboard/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-svh max-w-sm flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold tracking-tight">
        Dashboard Login
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Admin only. Enter the dashboard password to continue.
      </p>

      <form action={login} className="mt-6 flex flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {error && (
          <p className="text-sm text-destructive">
            Incorrect password. Try again.
          </p>
        )}
        <Button type="submit" nativeButton>
          Log in
        </Button>
      </form>
    </div>
  );
}
