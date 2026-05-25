export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-4 py-12">
      <h1 className="text-3xl font-bold">teamsync</h1>
      <p className="mt-3 text-slate-600">
        Client status pages for freelancers. Your client opens a private link — no
        account, no app.
      </p>
      <p className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-600">
        A client link looks like{" "}
        <code className="rounded bg-white px-1.5 py-0.5 font-mono text-slate-800">
          /c/your-token
        </code>
        .
      </p>
    </main>
  );
}
