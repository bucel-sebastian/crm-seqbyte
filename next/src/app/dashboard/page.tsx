export default function Page() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">CRM dashboard</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Keep clients, companies, and invoices in one place.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Use the dashboard to jump straight into the main workflows, check current volume, and create new records without leaving the shell.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Clients</p>
          <p className="mt-2 text-3xl font-semibold">Fast lookup</p>
          <p className="mt-2 text-sm text-muted-foreground">Review client records, open details, or add a new one.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Companies</p>
          <p className="mt-2 text-3xl font-semibold">Source of truth</p>
          <p className="mt-2 text-sm text-muted-foreground">Keep billing entities and company data organized.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Billing</p>
          <p className="mt-2 text-3xl font-semibold">Invoice flow</p>
          <p className="mt-2 text-sm text-muted-foreground">Create invoices and numbering series from one place.</p>
        </div>
      </div>
    </div>
  );
}
