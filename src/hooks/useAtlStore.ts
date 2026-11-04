import { useCallback, useEffect, useMemo, useState } from "react";
import { createFirstPage, createNextPage } from "@/lib/atlPages";
import type { AtlPage, AtlState } from "@/types/atl";

const STORAGE_KEY = "gremar-atl-carnet-v1";

function isAtlPage(value: unknown): value is AtlPage {
  return typeof value === "object" && value !== null && "id" in value && "pageNumber" in value && "flights" in value;
}

function loadState(): AtlState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null && Array.isArray((parsed as AtlState).pages)) {
        const pages = (parsed as AtlState).pages.filter(isAtlPage);
        if (pages.length > 0) {
          const hasOpen = pages.some((p) => !p.archivedAt);
          if (hasOpen) return { pages };
          const last = pages.reduce((a, b) => (b.pageNumber > a.pageNumber ? b : a));
          return { pages: [...pages, createNextPage(last)] };
        }
      }
    }
  } catch {
    // Données corrompues : on repart d'un carnet neuf.
  }
  return { pages: [createFirstPage()] };
}

export function useAtlStore() {
  const [state, setState] = useState<AtlState>(loadState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const currentPage = useMemo(() => state.pages.find((p) => !p.archivedAt) ?? state.pages[0], [state.pages]);

  const archives = useMemo(
    () => state.pages.filter((p) => p.archivedAt).sort((a, b) => b.pageNumber - a.pageNumber),
    [state.pages]
  );

  const updatePage = useCallback((id: string, patch: Partial<AtlPage>) => {
    setState((s) => ({ pages: s.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }, []);

  const deleteArchive = useCallback((id: string) => {
    setState((s) => ({ pages: s.pages.filter((p) => !(p.id === id && p.archivedAt)) }));
  }, []);

  const archiveCurrent = useCallback(() => {
    setState((s) => {
      const open = s.pages.find((p) => !p.archivedAt);
      if (!open) return s;
      const archived: AtlPage = { ...open, archivedAt: new Date().toISOString() };
      const next = createNextPage(archived);
      return { pages: [...s.pages.map((p) => (p.id === open.id ? archived : p)), next] };
    });
  }, []);

  return { currentPage, archives, updatePage, archiveCurrent, deleteArchive };
}
