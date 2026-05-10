import { useState, useCallback } from "react";
import { CreateCompanyInput } from "@/lib/validators";

interface UseCompanyLookupReturn {
  loading: boolean;
  error: string | null;
  data: Partial<CreateCompanyInput> | null;
  lookupByVat: (vat: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook pentru obtinerea datelor companiei din serviciul ANAF dupa VAT/CUI
 * @returns Obiect cu stari de loading, error, data si functia de cautare
 */
export function useCompanyLookup(): UseCompanyLookupReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Partial<CreateCompanyInput> | null>(null);

  const lookupByVat = useCallback(async (vat: string) => {
    if (!vat.trim()) {
      setError("VAT este obligatoriu");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`/api/companies/lookup?vat=${encodeURIComponent(vat)}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nu s-au putut obtine datele companiei");
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error("Raspuns invalid de la server");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "A aparut o eroare neasteptata";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { loading, error, data, lookupByVat, reset };
}
