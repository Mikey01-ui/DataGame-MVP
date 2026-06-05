"use client";

import {
  BOARD_PPT,
  HEADCOUNT_METRICS,
  HR_AUTH_ROWS,
  VAULT_AUDIT_ROWS,
} from "@/lib/game/m1/data";

export function M1BoardReport() {
  return (
    <div className="ppt-view" style={{ padding: 12, fontFamily: "Tahoma, sans-serif", fontSize: 11 }}>
      <div className="ppt-slide" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: "#333" }}>{BOARD_PPT.workforce.title}</div>
        {BOARD_PPT.workforce.divisions.map((d) => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 120 }}>{d.name}</span>
            <div style={{ flex: 1, height: 14, background: "#eee", borderRadius: 2 }}>
              <div
                style={{
                  width: `${(d.headcount / 890) * 100}%`,
                  height: "100%",
                  background: d.name === "Engineering" ? "#f79421" : "#4a7fc1",
                  borderRadius: 2,
                }}
              />
            </div>
            <span style={{ width: 36, textAlign: "right" }}>{d.headcount}</span>
          </div>
        ))}
      </div>
      <div className="ppt-slide">
        <div style={{ fontWeight: 700, marginBottom: 8, color: "#333" }}>{BOARD_PPT.revenue.title}</div>
        {BOARD_PPT.revenue.segments.map((s) => (
          <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid #eee" }}>
            <span>{s.label}</span>
            <strong style={{ color: s.label.includes("Classified") ? "#f79421" : "#333" }}>{s.pct}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function M1HrAuthView() {
  return (
    <table className="dt-compact" style={{ width: "100%", margin: 12, fontFamily: "Tahoma", fontSize: 11 }}>
      <thead>
        <tr>
          <th>Division</th>
          <th>OT Hours</th>
          <th>Authorised By</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {HR_AUTH_ROWS.map((r) => (
          <tr key={r.division} className={r.division.includes("Classified") ? "crow" : undefined}>
            <td>{r.division}</td>
            <td>{r.hours.toLocaleString()}h</td>
            <td style={{ fontWeight: r.authorisedBy === "R. Marshall" ? 700 : 400 }}>{r.authorisedBy}</td>
            <td>{r.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function M1HeadcountView() {
  return (
    <table className="dt-compact" style={{ width: "100%", margin: 12, fontFamily: "Tahoma", fontSize: 11 }}>
      <thead>
        <tr>
          <th>Division</th>
          <th>Staff Count</th>
          <th>Avg OT / Employee</th>
        </tr>
      </thead>
      <tbody>
        {HEADCOUNT_METRICS.map((r) => (
          <tr key={r.division}>
            <td>{r.division}</td>
            <td>{r.staff}</td>
            <td style={{ fontWeight: r.avgOt >= 20 ? 700 : 400, color: r.avgOt >= 20 ? "#b00020" : undefined }}>
              {r.avgOt}h
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function M1VaultAuditView() {
  return (
    <table className="dt-compact" style={{ width: "100%", margin: 12, fontFamily: "Tahoma", fontSize: 11 }}>
      <thead>
        <tr>
          <th>Department</th>
          <th>Access Count (Q3)</th>
        </tr>
      </thead>
      <tbody>
        {VAULT_AUDIT_ROWS.map((r) => (
          <tr key={r.department}>
            <td>{r.department}</td>
            <td style={{ fontWeight: r.accesses === 47 ? 700 : 400 }}>{r.accesses}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
