"use client";

import { getDocumentPreview } from "@/lib/game/m3/previews";
import type { Dataset } from "@/lib/game/m3/types";

export function M3Inspector({ dataset }: { dataset: Dataset }) {
  return (
    <div
      className="r2-ins-preview"
      dangerouslySetInnerHTML={{ __html: getDocumentPreview(dataset.id) }}
    />
  );
}
