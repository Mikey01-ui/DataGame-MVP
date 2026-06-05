"use client";

import { getDocumentPreview } from "@/lib/game/m3/previews";

type Props = {
  fileId: string;
  fileName: string;
  onClose: () => void;
};

export function M4FilePreview({ fileId, fileName, onClose }: Props) {
  return (
    <div className="m4-preview-overlay" role="dialog" aria-modal="true" aria-label={`Preview ${fileName}`}>
      <div className="m4-preview-backdrop" onClick={onClose} />
      <div className="m4-preview-panel">
        <div className="m4-preview-hdr">
          <span className="m4-preview-title">{fileName}</span>
          <button type="button" className="m4-preview-close" onClick={onClose} aria-label="Close preview">
            <i className="fas fa-times" aria-hidden />
          </button>
        </div>
        <div className="m4-preview-body" dangerouslySetInnerHTML={{ __html: getDocumentPreview(fileId) }} />
      </div>
    </div>
  );
}
