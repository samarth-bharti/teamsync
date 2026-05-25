import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Link not found</h1>
      <p className="mt-2 text-slate-600">
        This status link isn&apos;t valid, or it may have been removed. Please check
        with the person who shared it.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-blue-600 hover:underline"
      >
        Go to teamsync
      </Link>
    </main>
  );
}
