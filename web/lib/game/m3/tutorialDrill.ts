const DRILL_FILES: Record<string, string> = {
  payroll: "SAMPLE_Comp_Review.csv",
  omni_exec: "SAMPLE_ROI_Summary.pdf",
  risk_full: "SAMPLE_HR_Export.xlsx",
  pipeline: "SAMPLE_Architecture.json",
  health: "SAMPLE_Health.dat",
  web_logs: "SAMPLE_Session_Log.dat",
  cust_dump: "SAMPLE_User_Backup.csv",
  memo_847: "SAMPLE_Policy.md",
  schools: "SAMPLE_Roster.csv",
  api_abuse: "SAMPLE_Alert_Log.txt",
};

export function m3TutDrillFileName(id: string): string {
  return DRILL_FILES[id] ?? `SAMPLE_${id.replace(/_/g, "-")}.dat`;
}

function docWrap(bodyHtml: string): string {
  return (
    '<div class="m3-tut-doc">' +
    '<div class="m3-tut-doc-watermark">Tutorial sample · redacted · not mission data</div>' +
    `<div class="m3-tut-doc-body">${bodyHtml}</div></div>`
  );
}

export function m3TutGetDocumentPreview(id: string): string {
  switch (id) {
    case "payroll":
      return docWrap(
        '<div style="margin-bottom:8px;color:#5a7a8a">Comp review · <span class="m3-tut-redact">███ rows masked</span></div>' +
          "<table><tr><th>Ref</th><th>Region</th><th>Band</th><th>Flag</th></tr>" +
          '<tr><td><span class="m3-tut-redact">ANON-██</span></td><td>West</td><td><span class="m3-tut-redact">$███,800</span></td><td style="color:#f79421">ADJ_??</td></tr>' +
          '<tr><td><span class="m3-tut-redact">ANON-██</span></td><td>East</td><td><span class="m3-tut-redact">$███,200</span></td><td style="color:#f79421">ADJ_??</td></tr>' +
          '<tr><td><span class="m3-tut-redact">ANON-██</span></td><td>Central</td><td><span class="m3-tut-redact">$███,750</span></td><td>OK</td></tr>' +
          "</table><p style=\"margin-top:8px;color:#5a7a8a\">Real mission uses full comp tables — read harm before routing.</p>"
      );
    case "omni_exec":
      return docWrap(
        '<div style="font-size:11px;color:#8ab0c0;margin-bottom:8px">Executive summary · <span class="m3-tut-redact">FY20██</span></div>' +
          "<p>Revenue impact: <span class=\"m3-tut-redact\">$█.█M</span> · Implementation: <span class=\"m3-tut-redact\">$███K</span></p>" +
          "<p>Adoption (aggregates only): Healthcare <span class=\"m3-tut-redact\">██%</span> · Finance <span class=\"m3-tut-redact\">██%</span> · Other <span class=\"m3-tut-redact\">██%</span></p>" +
          "<p style=\"margin-top:8px;color:#5a7a8a\">No names in this drill file — practice spotting press-safe aggregates.</p>"
      );
    default:
      return docWrap(
        "<p>Staged leak preview · <span class=\"m3-tut-redact\">████████</span></p>" +
          "<p>Identifiers: <span class=\"m3-tut-redact\">redacted</span> · Harm if public: <span class=\"m3-tut-redact\">see mission</span></p>" +
          "<p style=\"color:#5a7a8a\">Open real files in Mission 3 after the vault breach.</p>"
      );
  }
}
