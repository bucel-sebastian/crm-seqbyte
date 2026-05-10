export default function Page() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Tablou CRM</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Pastreaza clientii, companiile si facturile intr-un singur loc.
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            Foloseste tabloul pentru a intra direct in fluxurile principale, pentru a verifica volumul curent si pentru a crea inregistrari noi fara sa parasesti aplicatia.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Clienti</p>
          <p className="mt-2 text-3xl font-semibold">Cautare rapida</p>
          <p className="mt-2 text-sm text-muted-foreground">Revizuieste clientii, deschide detalii sau adauga unul nou.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Companii</p>
          <p className="mt-2 text-3xl font-semibold">Sursa principala</p>
          <p className="mt-2 text-sm text-muted-foreground">Pastreaza organizate entitatile de facturare si datele companiilor.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Facturare</p>
          <p className="mt-2 text-3xl font-semibold">Flux facturi</p>
          <p className="mt-2 text-sm text-muted-foreground">Creeaza facturi si serii de numerotare dintr-un singur loc.</p>
        </div>
      </div>
    </div>
  );
}
