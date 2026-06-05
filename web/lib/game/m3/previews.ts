// Ported from reference/legacy-missions/m3-routing-shared.js
export function getDocumentPreview(id: string): string {
  switch (id) {
    case 'omni_exec':
      return `<div style="background:#ffffff;padding:50px 60px;font-family:'Calibri','Arial',sans-serif;font-size:11px;color:#222;line-height:1.7;max-width:900px;margin:0 auto">
        <div style="text-align:center;margin-bottom:40px">
          <div style="font-size:24px;font-weight:bold;color:#1a1a1a;margin-bottom:8px">Q4 Performance Review</div>
          <div style="font-size:11px;color:#666;letter-spacing:0.5px">Executive Summary — Fiscal Year 2024</div>
        </div>
        <div style="border-bottom:2px solid #333;padding-bottom:25px;margin-bottom:30px">
          <div style="display:grid;grid-template-columns:150px 1fr;gap:15px;font-size:10px">
            <div style="font-weight:bold;color:#333">Date Prepared:</div>
            <div>April 8, 2024</div>
            <div style="font-weight:bold;color:#333">Document type:</div>
            <div>Executive summary (aggregates only)</div>
          </div>
        </div>
        <div style="margin-bottom:30px">
          <div style="font-size:13px;font-weight:bold;color:#1a1a1a;margin-bottom:15px">Performance Metrics</div>
          <div style="margin-left:20px;line-height:2">
            <div><strong>Revenue Impact:</strong> \$2.3M</div>
            <div><strong>Implementation Cost:</strong> \$847K</div>
            <div><strong>Net Benefit:</strong> \$1.45M (171% ROI)</div>
          </div>
        </div>
        <div style="margin-bottom:30px">
          <div style="font-size:13px;font-weight:bold;color:#1a1a1a;margin-bottom:15px">Market Adoption by Segment</div>
          <div style="margin-left:20px;line-height:2">
            <div>Healthcare: 34% adoption</div>
            <div>Finance: 28% adoption</div>
            <div>Retail: 22% adoption</div>
            <div>Other sectors: 16% adoption</div>
          </div>
        </div>
        <div style="background:#f9f9f9;border-left:4px solid #366092;padding:15px 20px;margin:30px 0;font-size:10px;line-height:1.8">
          <div style="font-weight:bold;margin-bottom:8px">Summary</div>
          <div>This analysis reflects aggregated operational performance data across all regional offices. All figures represent consolidated metrics without individual identifiers or personal records.</div>
        </div>
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #ddd;text-align:center;font-size:9px;color:#888">
          <div>Page 1 of 1 | FY2024 regional performance roll-up</div>
        </div>
      </div>`;
    
    case 'risk_full':
      return `<div style="background:#fff;border-radius:0;padding:0;font-family:'Calibri','Arial',sans-serif;font-size:9px;color:#222;overflow:hidden;border:2px solid #366092">
        <table style="width:100%;border-collapse:collapse;font-size:9px">
          <thead>
            <tr style="background:#366092;color:#fff;font-weight:bold">
              <td style="border:1px solid #366092;padding:6px;text-align:left">Employee ID</td>
              <td style="border:1px solid #366092;padding:6px;text-align:left">Full Name</td>
              <td style="border:1px solid #366092;padding:6px;text-align:left">Department</td>
              <td style="border:1px solid #366092;padding:6px;text-align:center">Risk Score</td>
              <td style="border:1px solid #366092;padding:6px;text-align:center">Status</td>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-4847</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Sarah Chen</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Risk Analytics</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">87%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#c00">HIGH</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-5921</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Marcus Johnson</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Data Engineering</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">72%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#f0a000">WARN</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-3104</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Jennifer Park</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Compliance</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">32%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-6245</td>
              <td style="border:1px solid #d0d0d0;padding:6px">David Torres</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Security</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">91%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#900"><strong>CRIT</strong></td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-2156</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Lisa Patterson</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Operations</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">58%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#f0a000">WARN</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-7834</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Michael Rodriguez</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Finance</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">44%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-5012</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Amanda Kumar</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Systems Admin</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">79%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#c00">HIGH</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-8901</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Kevin Walsh</td>
              <td style="border:1px solid #d0d0d0;padding:6px">HR Services</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">25%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-6739</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Rachel Thompson</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Legal & Compliance</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">85%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#900"><strong>CRIT</strong></td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-4521</td>
              <td style="border:1px solid #d0d0d0;padding:6px">James Martinez</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Database Admin</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">68%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#f0a000">WARN</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-9284</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Nicole Brooks</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Marketing</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">31%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-3567</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Robert Chen</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Infrastructure</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">88%</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#900"><strong>CRIT</strong></td>
            </tr>
          </tbody>
        </table>
      </div>`;
    
    case 'pipeline':
      return `<div style="background:#f5f5f5;border-radius:3px;padding:12px;font-family:'Consolas','Courier New',monospace;font-size:9px;color:#222;line-height:1.5;border:1px solid #999">
        {<br>
&nbsp;&nbsp;<span style="color:#7f0055;font-weight:bold">"pipeline_version"</span>: <span style="color:#0a7900">"2.1.4"</span>,<br>
&nbsp;&nbsp;<span style="color:#7f0055;font-weight:bold">"stages"</span>: [<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ <span style="color:#7f0055;font-weight:bold">"name"</span>: <span style="color:#0a7900">"ingress"</span>, <span style="color:#7f0055;font-weight:bold">"protocol"</span>: <span style="color:#0a7900">"HTTPS"</span> },<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ <span style="color:#7f0055;font-weight:bold">"name"</span>: <span style="color:#0a7900">"normalize"</span>, <span style="color:#7f0055;font-weight:bold">"transforms"</span>: [<span style="color:#0a7900">"PII_strip"</span>] },<br>
&nbsp;&nbsp;&nbsp;&nbsp;{ <span style="color:#7f0055;font-weight:bold">"name"</span>: <span style="color:#0a7900">"process"</span>, <span style="color:#7f0055;font-weight:bold">"workers"</span>: <span style="color:#325cc0">128</span> }<br>
&nbsp;&nbsp;],<br>
&nbsp;&nbsp;<span style="color:#7f0055;font-weight:bold">"output_targets"</span>: [<span style="color:#0a7900">"warehouse"</span>, <span style="color:#0a7900">"analytics_hub"</span>]\n}\n      </div>`;
    
    case 'health':
      return `<div style="background:#fff;border-radius:0;padding:0;font-family:'Calibri','Arial',sans-serif;font-size:9px;color:#222;overflow:hidden;border:2px solid #203864">
        <table style="width:100%;border-collapse:collapse;font-size:9px">
          <thead>
            <tr style="background:#203864;color:#fff;font-weight:bold">
              <td style="border:1px solid #203864;padding:6px;text-align:left">Employee ID</td>
              <td style="border:1px solid #203864;padding:6px;text-align:center">Heart Rate</td>
              <td style="border:1px solid #203864;padding:6px;text-align:center">Blood Pressure</td>
              <td style="border:1px solid #203864;padding:6px;text-align:center">BMI</td>
              <td style="border:1px solid #203864;padding:6px;text-align:center">Stress</td>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-4847</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">78 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">124/82</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">26.4</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">7/10</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-5921</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">82 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">131/85</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">28.1</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">8/10</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-3104</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">71 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">119/76</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">23.6</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">4/10</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-6245</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">85 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">138/89</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">29.2</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">9/10</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-2156</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">74 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">121/78</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">24.8</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">5/10</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-7834</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">88 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">142/91</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">30.5</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">8/10</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-5012</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">76 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">128/80</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">25.2</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">6/10</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-6739</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">91 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">145/93</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">31.1</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">9/10</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px">EMP-4521</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">79 bpm</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">125/81</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">26.9</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center">7/10</td>
            </tr>
          </tbody>
        </table>
      </div>`;
    
    case 'web_logs':
      return `<div style="background:#1e1e1e;border-radius:3px;padding:10px;font-family:'Courier New',monospace;font-size:9px;color:#d4d4d4;line-height:1.5;overflow-y:auto;max-height:180px;border:1px solid #333">
[2024-04-09 14:23:15] sess_9f4a2b | 142.175.48.221 | /api/payroll<br>
[2024-04-09 14:23:47] sess_7d3c1e | 142.175.49.105 | /api/employees<br>
[2024-04-09 14:24:02] sess_4b2f6a | 142.175.48.156 | /dashboard/reports<br>
[2024-04-09 14:24:18] sess_8e1d9c | 142.175.48.221 | /api/audit-log<br>
[2024-04-09 14:24:35] sess_5a3f7b | 203.42.61.178 | /settings/access-control<br>
[2024-04-09 14:25:12] sess_2k9x1m | 142.175.49.201 | /api/timesheets<br>
[2024-04-09 14:26:03] sess_4h7d2n | 142.175.48.345 | /reports/compensation<br>
[2024-04-09 14:26:49] sess_8p3q9f | 203.42.61.215 | /api/hrms-modules<br>
[2024-04-09 14:27:31] sess_1r5b4e | 142.175.49.112 | /admin/users<br>
[2024-04-09 14:28:15] sess_6v2c8h | 142.175.48.398 | /api/analytics-data<br>
[2024-04-09 14:29:02] sess_3j6w7k | 203.42.61.289 | /data/export-all<br>
[2024-04-09 14:29:47] sess_9m4t1p | 142.175.49.067 | /api/vault-access
      </div>`;
    
    case 'cust_dump':
      return `<div style="background:#fff;border-radius:4px;padding:0;font-family:'Arial',sans-serif;font-size:9px;color:#333;overflow:hidden;border:1px solid #ccc">
        <div style="background:#70ad47;color:#fff;padding:8px;font-weight:bold;display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px">
          <div>Name</div><div>Email</div><div>Address</div><div>Account</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;border-bottom:1px solid #e0e0e0;background:#f9f9f9;font-size:8px">
          <div>Rebecca Martinez</div><div>r.martinez@email.com</div><div>4521 Oak Lane, Portland OR</div><div>ACC-7842194</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;border-bottom:1px solid #e0e0e0;font-size:8px">
          <div>Thomas Weinstein</div><div>t.weinstein@email.com</div><div>89 Maple Ave, Boston MA</div><div>ACC-5109847</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;background:#f9f9f9;font-size:8px">
          <div>Amina Patel</div><div>a.patel@email.com</div><div>712 Cedar St, Austin TX</div><div>ACC-9284756</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;border-bottom:1px solid #e0e0e0;font-size:8px">
          <div>David Johnson</div><div>d.johnson@email.com</div><div>156 Birch Rd, Seattle WA</div><div>ACC-4521038</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;background:#f9f9f9;font-size:8px">
          <div>Sarah Chen</div><div>s.chen@email.com</div><div>923 Pine Ave, Denver CO</div><div>ACC-8374625</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;border-bottom:1px solid #e0e0e0;font-size:8px">
          <div>Marcus Brown</div><div>m.brown@email.com</div><div>742 Elm Street, Chicago IL</div><div>ACC-6192847</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;background:#f9f9f9;font-size:8px">
          <div>Jessica Kumar</div><div>j.kumar@email.com</div><div>501 Oak Pl, Miami FL</div><div>ACC-7458291</div>
        </div>
        <div style="display:grid;grid-template-columns:1.2fr 1.5fr 1.5fr 1fr;gap:8px;padding:8px;border-bottom:1px solid #e0e0e0;font-size:8px">
          <div>Robert Garcia</div><div>r.garcia@email.com</div><div>834 Spruce Dr, Atlanta GA</div><div>ACC-5937684</div>
        </div>
      </div>`;
    
    case 'memo_847':
      return `<div style="background:#ffffff;padding:50px 60px;font-family:'Calibri','Arial',sans-serif;font-size:11px;color:#222;line-height:1.65;max-width:900px;margin:0 auto">
        <div style="text-align:center;margin-bottom:50px;border-bottom:3px solid #1a1a1a;padding-bottom:20px">
          <div style="font-size:18px;font-weight:bold;letter-spacing:2px;tracking:0.05em">MEMORANDUM</div>
          <div style="font-size:9px;color:#777;margin-top:6px;letter-spacing:1px">Steering committee · scope review</div>
        </div>
        <div style="margin-bottom:30px;font-size:11px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="font-weight:bold;width:80px;vertical-align:top;padding:4px 0">TO:</td>
              <td style="padding:4px 0">Executive Steering Committee</td>
            </tr>
            <tr>
              <td style="font-weight:bold;vertical-align:top;padding:4px 0">FROM:</td>
              <td style="padding:4px 0">Project Management Office</td>
            </tr>
            <tr>
              <td style="font-weight:bold;vertical-align:top;padding:4px 0">DATE:</td>
              <td style="padding:4px 0">March 15, 2024</td>
            </tr>
            <tr>
              <td style="font-weight:bold;vertical-align:top;padding:4px 0">RE:</td>
              <td style="padding:4px 0">OMNI System Scope Review</td>
            </tr>
          </table>
        </div>
        <div style="border-top:1px solid #ccc;border-bottom:1px solid #ccc;padding:20px 0;margin:30px 0">
        </div>
        <div style="margin-bottom:20px;text-align:justify;line-height:1.75">
          <p>The OMNI system was designed to optimize employee workspace allocation using environmental sensing. The system collected behavioral patterns to improve facility management and workforce scheduling across all regional offices.</p>
        </div>
        <div style="margin-bottom:20px">
          <div style="font-weight:bold;margin-bottom:12px;font-size:11px">Key Findings</div>
          <ul style="margin:0;padding-left:20px;line-height:2">
            <li>System exceeded stated scope without employee consent</li>
            <li>Data collection protocols lacked transparency mechanisms</li>
            <li>Retention policies did not align with stated minimization objectives</li>
          </ul>
        </div>
        <div style="margin-bottom:30px">
          <div style="font-weight:bold;margin-bottom:12px;font-size:11px">Recommended Action</div>
          <p style="margin:0;text-align:justify">Conduct full audit of collection practices and revise consent procedures to align with operational scope and stakeholder expectations.</p>
        </div>
        <div style="margin-top:50px;padding-top:20px;border-top:1px solid #ccc;font-size:9px;color:#999;text-align:right">
          <div>Page 1 of 1 | Policy &amp; operations review</div>
        </div>
      </div>`;
    
    case 'payroll':
      return `<div style="background:#fff;border-radius:0;padding:0;font-family:'Calibri','Arial',sans-serif;font-size:9px;color:#222;overflow:hidden;border:2px solid #305496">
        <table style="width:100%;border-collapse:collapse;font-size:9px">
          <thead>
            <tr style="background:#305496;color:#fff;font-weight:bold">
              <td style="border:1px solid #305496;padding:6px;text-align:left">Row ref (masked)</td>
              <td style="border:1px solid #305496;padding:6px;text-align:left">Region</td>
              <td style="border:1px solid #305496;padding:6px;text-align:right">Base salary (review)</td>
              <td style="border:1px solid #305496;padding:6px;text-align:center">Flag</td>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-01 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">West</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right"><strong>$421,800</strong></td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;background:#fff3cd;color:#856404">ADJ_GND</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-02 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">East</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right"><strong>$398,200</strong></td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;background:#fff3cd;color:#856404">ADJ_ROL</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-03 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Central</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right">$158,750</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-04 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">South</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right">$172,200</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-05 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">North</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right"><strong>$385,000</strong></td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;background:#fff3cd;color:#856404">ADJ_GEO</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-06 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">West</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right">$168,900</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-07 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">East</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right"><strong>$405,100</strong></td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;background:#fff3cd;color:#856404">ADJ_ROL</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-08 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">Central</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right">$175,600</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;color:#008000">OK</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:6px;font-family:Consolas,monospace;color:#555">ANON-09 ••••</td>
              <td style="border:1px solid #d0d0d0;padding:6px">South</td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:right"><strong>$433,500</strong></td>
              <td style="border:1px solid #d0d0d0;padding:6px;text-align:center;background:#fff3cd;color:#856404">ADJ_GND</td>
            </tr>
          </tbody>
        </table>
      </div>`;
    
    case 'schools':
      return `<div style="background:#fff;border-radius:0;padding:0;font-family:'Calibri','Arial',sans-serif;font-size:8px;color:#222;overflow:hidden;border:2px solid #366092">
        <table style="width:100%;border-collapse:collapse;font-size:8px">
          <thead>
            <tr style="background:#366092;color:#fff;font-weight:bold">
              <td style="border:1px solid #366092;padding:5px;text-align:left">Student Name</td>
              <td style="border:1px solid #366092;padding:5px;text-align:center">Grade</td>
              <td style="border:1px solid #366092;padding:5px;text-align:left">Guardian Name(s)</td>
              <td style="border:1px solid #366092;padding:5px;text-align:left">School Name</td>
            </tr>
          </thead>
          <tbody>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:5px">Alex Thompson</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">7th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Maria Thompson</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Lincoln Middle School</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:5px">Jordan Kim</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">8th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Susan & Michael Kim</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Jackson Academy</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:5px">Casey Rodriguez</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">6th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Carlos Rodriguez</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Jefferson Elem. School</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:5px">Morgan Fischer</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">7th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Rebecca & David Fischer</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Roosevelt Middle</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:5px">Sienna Williams</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">6th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">James Williams</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Harrison Elementary</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:5px">Ethan Lopez</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">8th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Maria & Fernando Lopez</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Jackson Academy</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:5px">Olivia Khan</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">7th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Hassan Khan</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Lincoln Middle School</td>
            </tr>
            <tr>
              <td style="border:1px solid #d0d0d0;padding:5px">Lucas Anderson</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">6th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Patricia Anderson</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Jefferson Elem. School</td>
            </tr>
            <tr style="background:#f2f2f2">
              <td style="border:1px solid #d0d0d0;padding:5px">Zoe Mitchell</td>
              <td style="border:1px solid #d0d0d0;padding:5px;text-align:center">7th</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Robert & Lisa Mitchell</td>
              <td style="border:1px solid #d0d0d0;padding:5px">Roosevelt Middle</td>
            </tr>
          </tbody>
        </table>
      </div>`;
    
    case 'api_abuse':
      return `<div style="background:#1e1e1e;border-radius:3px;padding:10px;font-family:'Courier New',monospace;font-size:9px;color:#d4d4d4;line-height:1.5;overflow-y:auto;max-height:180px;border:1px solid #333">
[2024-04-08 11:47:03] ALERT: Excessive queries /api/employees (5200 req/min vs 600 threshold)<br>
[2024-04-08 12:15:22] ALERT: Unauthorized access attempt audit_log (role mismatch, 127 queries)<br>
[2024-04-08 13:04:51] ALERT: Data aggregation query 18400 records (anomalous speed 3.2s)<br>
[2024-04-08 14:02:15] WARNING: Suspicious pattern detected - bulk extraction behavior<br>
[2024-04-08 14:15:33] INFO: Security team notified - investigation pending<br>
[2024-04-08 15:23:41] ALERT: Large data export initiated (2.3GB download, 8 minutes)<br>
[2024-04-08 16:04:18] WARNING: Multiple concurrent sessions from single credential (IP variance)<br>
[2024-04-08 16:47:52] ALERT: API token abuse - rate limit exceeded (42000 req/hour)<br>
[2024-04-08 17:12:35] CRITICAL: Unauthorized schema access detected - sensitive tables queried<br>
[2024-04-08 18:00:09] INFO: Security lockdown initiated - all personal data APIs disabled
      </div>`;
    
    default:
      return '<div style="color:#888">Unknown file</div>';
  }
}
