// University Export and Official Transcript Generation Utilities

export function exportStudentsToCSV(students, filename = "Apex_University_Student_Records.csv") {
  if (!students || students.length === 0) return;

  const headers = ["Student ID", "National Reg ID", "Full Name", "Department", "Academic Program", "Year Level", "Semester", "Cumulative GPA", "Completed Credits", "Academic Standing", "Advisor"];
  const rows = students.map(s => [
    `"${s.studentId}"`,
    `"${s.nationalId}"`,
    `"${s.fullName}"`,
    `"${s.department}"`,
    `"${s.program}"`,
    `"${s.yearLevel}"`,
    s.semester,
    s.gpa.toFixed(2),
    s.creditsCompleted,
    `"${s.status}"`,
    `"${s.advisor || 'Not Assigned'}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data, filename = "Apex_University_Dataset.json") {
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonStr);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printOfficialTranscript(student) {
  const printWindow = window.open("", "_blank");
  const currentDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Official Academic Transcript - ${student.fullName}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
            padding: 48px; 
            color: #0f172a; 
            max-width: 820px; 
            margin: 0 auto; 
          }
          .uni-header { 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            border-bottom: 3px solid #1e3a8a; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .uni-title h1 { 
            font-size: 26px; 
            margin: 0; 
            color: #1e3a8a; 
            font-weight: 800; 
            letter-spacing: -0.025em; 
          }
          .uni-title p { 
            margin: 4px 0 0; 
            color: #475569; 
            font-size: 13px; 
          }
          .doc-type { 
            text-align: right; 
          }
          .doc-type span { 
            display: inline-block; 
            padding: 6px 14px; 
            background: #eff6ff; 
            color: #1e40af; 
            font-weight: 700; 
            font-size: 13px; 
            border-radius: 6px; 
            border: 1px solid #bfdbfe; 
          }
          .doc-type small { 
            display: block; 
            margin-top: 4px; 
            color: #64748b; 
            font-size: 11px; 
          }
          .meta-box { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0; 
            border-radius: 8px; 
            padding: 20px; 
            margin-bottom: 25px; 
          }
          .meta-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 16px; 
          }
          .meta-item strong { 
            display: block; 
            font-size: 11px; 
            text-transform: uppercase; 
            color: #64748b; 
            margin-bottom: 3px; 
            letter-spacing: 0.05em; 
          }
          .meta-item span { 
            font-size: 15px; 
            font-weight: 600; 
            color: #0f172a; 
          }
          .standing-pill { 
            display: inline-block; 
            padding: 3px 8px; 
            background: #dcfce7; 
            color: #166534; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: 700; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 15px; 
            font-size: 13px; 
          }
          th { 
            background: #f1f5f9; 
            text-align: left; 
            padding: 10px 12px; 
            border-bottom: 2px solid #cbd5e1; 
            color: #334155; 
            font-weight: 700; 
          }
          td { 
            padding: 10px 12px; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .summary-footer { 
            margin-top: 40px; 
            border-top: 2px solid #e2e8f0; 
            padding-top: 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-end; 
          }
          .signature-box { 
            text-align: center; 
          }
          .signature-line { 
            width: 200px; 
            border-bottom: 1px solid #0f172a; 
            margin-bottom: 6px; 
          }
          .watermark { 
            font-size: 11px; 
            color: #94a3b8; 
          }
        </style>
      </head>
      <body>
        <div class="uni-header">
          <div class="uni-title">
            <h1>Apex University</h1>
            <p>Office of the University Registrar &bull; Division of Academic Records</p>
          </div>
          <div class="doc-type">
            <span>OFFICIAL TRANSCRIPT</span>
            <small>Issue Date: ${currentDate}</small>
          </div>
        </div>

        <div class="meta-box">
          <div class="meta-grid">
            <div class="meta-item">
              <strong>Student Full Name</strong>
              <span>${student.fullName}</span>
            </div>
            <div class="meta-item">
              <strong>Student University ID</strong>
              <span style="font-family: monospace;">${student.studentId}</span>
            </div>
            <div class="meta-item">
              <strong>Academic Program / Major</strong>
              <span>${student.program}</span>
            </div>
            <div class="meta-item">
              <strong>Department / Faculty</strong>
              <span>${student.department}</span>
            </div>
            <div class="meta-item">
              <strong>Year Level / Term</strong>
              <span>${student.yearLevel} (Semester ${student.semester})</span>
            </div>
            <div class="meta-item">
              <strong>Academic Standing</strong>
              <span class="standing-pill">${student.status}</span>
            </div>
            <div class="meta-item">
              <strong>Cumulative GPA</strong>
              <span style="color: #1e40af; font-size: 18px;">${student.gpa.toFixed(2)} / 4.00</span>
            </div>
            <div class="meta-item">
              <strong>Credits Earned to Date</strong>
              <span>${student.creditsCompleted} Semester Credits</span>
            </div>
          </div>
        </div>

        <h3 style="margin-bottom: 8px; color: #1e3a8a; font-size: 16px;">Current Term Enrolled Course Portfolio</h3>
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Status</th>
              <th>Credit Weight</th>
              <th>Evaluation Basis</th>
            </tr>
          </thead>
          <tbody>
            ${(student.enrolledCourses || []).map(code => `
              <tr>
                <td style="font-family: monospace; font-weight: 700;">${code}</td>
                <td><span style="color: #15803d; font-weight: 600;">Enrolled & Active</span></td>
                <td>4.0 Units</td>
                <td>Letter Grade (A - F)</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="summary-footer">
          <div class="watermark">
            Security Identifier: SEC-${Math.floor(100000 + Math.random() * 900000)}<br>
            Verified via SIS Canonical Academic Store &bull; Official Digital Seal
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div style="font-size: 12px; font-weight: 700;">Dr. Helen Kingsley</div>
            <div style="font-size: 11px; color: #64748b;">University Registrar</div>
          </div>
        </div>

        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
