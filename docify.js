/*!
 * Docify.js v1.0.0
 * LLM-first document generation library
 * https://github.com/your-username/docify
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Docify = factory());
}(this, function () {

  // ─── TEMPLATES ────────────────────────────────────────────────────────────

  const templates = {

    invoice: (data) => {
      const items = data.items || [];
      const subtotal = items.reduce((s, i) => s + (i.qty * i.price), 0);
      const tax = subtotal * (data.tax || 0);
      const total = subtotal + tax;
      const brand = data.brand || {};
      const color = brand.color || '#2563eb';

      return `
        <div class="docify-doc docify-invoice" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 780px; margin: 0 auto; padding: 48px; background: #fff; color: #111;">
          <style>
            .docify-invoice table { width: 100%; border-collapse: collapse; }
            .docify-invoice th { background: ${color}; color: #fff; padding: 10px 14px; text-align: left; font-size: 13px; }
            .docify-invoice td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
            .docify-invoice tr:last-child td { border-bottom: none; }
            .docify-invoice .total-row td { font-weight: 700; background: #f8f9fa; }
            @media print { .docify-invoice { padding: 0; } }
          </style>

          <!-- Header -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px;">
            <div>
              ${brand.logo ? `<img src="${brand.logo}" style="height:48px; margin-bottom:8px; display:block;">` : ''}
              <div style="font-size:28px; font-weight:800; color:${color};">${brand.company || 'Company Name'}</div>
              <div style="font-size:13px; color:#666; margin-top:4px;">${brand.address || ''}</div>
              <div style="font-size:13px; color:#666;">${brand.email || ''}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:36px; font-weight:900; color:#111; letter-spacing:-1px;">INVOICE</div>
              <div style="font-size:13px; color:#666; margin-top:6px;">Invoice #: <strong>${data.invoice_number || 'INV-001'}</strong></div>
              <div style="font-size:13px; color:#666;">Date: <strong>${data.date || new Date().toLocaleDateString()}</strong></div>
              <div style="font-size:13px; color:#666;">Due: <strong>${data.due_date || 'On receipt'}</strong></div>
            </div>
          </div>

          <!-- Bill To -->
          <div style="background:#f8f9fa; border-left:4px solid ${color}; padding:16px 20px; margin-bottom:32px; border-radius:0 8px 8px 0;">
            <div style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#666; margin-bottom:6px;">Bill To</div>
            <div style="font-size:16px; font-weight:700;">${data.client || 'Client Name'}</div>
            ${data.client_email ? `<div style="font-size:13px; color:#666;">${data.client_email}</div>` : ''}
            ${data.client_address ? `<div style="font-size:13px; color:#666;">${data.client_address}</div>` : ''}
          </div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="width:80px; text-align:center;">Qty</th>
                <th style="width:120px; text-align:right;">Unit Price</th>
                <th style="width:120px; text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td style="text-align:center;">${item.qty}</td>
                  <td style="text-align:right;">$${Number(item.price).toFixed(2)}</td>
                  <td style="text-align:right;">$${(item.qty * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr><td colspan="3" style="text-align:right; padding:10px 14px; font-size:13px; color:#666;">Subtotal</td><td style="text-align:right; padding:10px 14px;">$${subtotal.toFixed(2)}</td></tr>
              ${data.tax ? `<tr><td colspan="3" style="text-align:right; padding:10px 14px; font-size:13px; color:#666;">Tax (${(data.tax*100).toFixed(0)}%)</td><td style="text-align:right; padding:10px 14px;">$${tax.toFixed(2)}</td></tr>` : ''}
              <tr class="total-row">
                <td colspan="3" style="text-align:right; padding:14px; font-size:15px;">Total</td>
                <td style="text-align:right; padding:14px; font-size:18px; color:${color};">$${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Note -->
          ${data.note ? `<div style="margin-top:32px; padding:16px; background:#f8f9fa; border-radius:8px; font-size:13px; color:#666;"><strong>Note:</strong> ${data.note}</div>` : ''}

          <!-- Footer -->
          <div style="margin-top:48px; padding-top:16px; border-top:1px solid #eee; font-size:12px; color:#999; text-align:center;">
            Thank you for your business.
          </div>
        </div>
      `;
    },

    resume: (data) => {
      const color = (data.brand && data.brand.color) || '#0f172a';
      const accent = (data.brand && data.brand.accent) || '#2563eb';
      return `
        <div class="docify-doc docify-resume" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 780px; margin: 0 auto; background: #fff; color: #111;">
          <style>
            .docify-resume h3 { margin: 0 0 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 4px; }
            .docify-resume .section { margin-bottom: 28px; }
            .docify-resume .exp-item { margin-bottom: 16px; }
            .docify-resume ul { margin: 6px 0 0 0; padding-left: 18px; }
            .docify-resume li { font-size: 13px; color: #444; margin-bottom: 3px; }
          </style>

          <!-- Header -->
          <div style="background:${color}; color:#fff; padding:40px 48px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:32px; font-weight:900; letter-spacing:-1px;">${data.name || 'Your Name'}</div>
              <div style="font-size:16px; color:rgba(255,255,255,0.75); margin-top:4px;">${data.title || 'Professional Title'}</div>
            </div>
            <div style="text-align:right; font-size:13px; color:rgba(255,255,255,0.75); line-height:1.8;">
              ${data.email ? `<div>${data.email}</div>` : ''}
              ${data.phone ? `<div>${data.phone}</div>` : ''}
              ${data.location ? `<div>${data.location}</div>` : ''}
              ${data.linkedin ? `<div>${data.linkedin}</div>` : ''}
            </div>
          </div>

          <div style="padding: 40px 48px;">
            <!-- Summary -->
            ${data.summary ? `
            <div class="section">
              <h3>Summary</h3>
              <p style="font-size:14px; color:#444; line-height:1.7; margin:0;">${data.summary}</p>
            </div>` : ''}

            <!-- Experience -->
            ${data.experience && data.experience.length ? `
            <div class="section">
              <h3>Experience</h3>
              ${data.experience.map(exp => `
                <div class="exp-item">
                  <div style="display:flex; justify-content:space-between; align-items:baseline;">
                    <div style="font-weight:700; font-size:15px;">${exp.role}</div>
                    <div style="font-size:12px; color:#888;">${exp.period || ''}</div>
                  </div>
                  <div style="font-size:13px; color:${accent}; margin-bottom:4px;">${exp.company}</div>
                  ${exp.points ? `<ul>${exp.points.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Education -->
            ${data.education && data.education.length ? `
            <div class="section">
              <h3>Education</h3>
              ${data.education.map(edu => `
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                  <div>
                    <div style="font-weight:700; font-size:14px;">${edu.degree}</div>
                    <div style="font-size:13px; color:#666;">${edu.school}</div>
                  </div>
                  <div style="font-size:12px; color:#888;">${edu.year || ''}</div>
                </div>
              `).join('')}
            </div>` : ''}

            <!-- Skills -->
            ${data.skills && data.skills.length ? `
            <div class="section">
              <h3>Skills</h3>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                ${data.skills.map(s => `<span style="background:#f1f5f9; border:1px solid #e2e8f0; padding:4px 12px; border-radius:20px; font-size:13px; color:#334155;">${s}</span>`).join('')}
              </div>
            </div>` : ''}
          </div>
        </div>
      `;
    },

    certificate: (data) => {
      const color = (data.brand && data.brand.color) || '#7c3aed';
      return `
        <div class="docify-doc docify-certificate" style="font-family: Georgia, serif; max-width: 780px; margin: 0 auto; background: #fff; padding: 60px; text-align: center; border: 12px double ${color}; box-sizing: border-box; position: relative;">
          <style>
            .docify-certificate .ornament { color: ${color}; font-size: 32px; }
          </style>
          <div class="ornament">✦ ✦ ✦</div>
          <div style="font-size:13px; text-transform:uppercase; letter-spacing:4px; color:#666; margin:16px 0 8px;">${data.brand && data.brand.company ? data.brand.company : 'Certificate of Achievement'}</div>
          <div style="font-size:40px; font-weight:900; color:${color}; letter-spacing:-1px; margin-bottom:8px;">Certificate</div>
          <div style="font-size:16px; text-transform:uppercase; letter-spacing:3px; color:#888; margin-bottom:32px;">of ${data.type || 'Completion'}</div>
          <div style="font-size:15px; color:#666; margin-bottom:8px;">This is to certify that</div>
          <div style="font-size:36px; font-style:italic; color:#111; border-bottom:2px solid ${color}; display:inline-block; padding:0 32px 8px; margin-bottom:24px;">${data.recipient || 'Recipient Name'}</div>
          <div style="font-size:15px; color:#444; max-width:500px; margin:0 auto 32px; line-height:1.7;">
            ${data.description || 'has successfully completed the requirements and is hereby awarded this certificate.'}
          </div>
          <div style="display:flex; justify-content:space-around; margin-top:48px;">
            <div>
              <div style="border-top:1px solid #ccc; padding-top:8px; font-size:13px; color:#666; width:160px;">${data.date || new Date().toLocaleDateString()}</div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#999; margin-top:2px;">Date</div>
            </div>
            <div>
              <div style="border-top:1px solid #ccc; padding-top:8px; font-size:13px; color:#666; width:160px;">${data.issuer || 'Authorized Signature'}</div>
              <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#999; margin-top:2px;">Signature</div>
            </div>
          </div>
          <div class="ornament" style="margin-top:32px;">✦ ✦ ✦</div>
        </div>
      `;
    },

    report: (data) => {
      const color = (data.brand && data.brand.color) || '#059669';
      return `
        <div class="docify-doc docify-report" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 780px; margin: 0 auto; background: #fff; color: #111;">
          <style>
            .docify-report h2 { font-size: 18px; font-weight: 700; color: ${color}; margin: 32px 0 12px; border-left: 4px solid ${color}; padding-left: 12px; }
            .docify-report p { font-size: 14px; line-height: 1.8; color: #444; margin: 0 0 12px; }
            .docify-report table { width: 100%; border-collapse: collapse; margin: 16px 0; }
            .docify-report th { background: ${color}; color: #fff; padding: 10px 14px; text-align: left; font-size: 13px; }
            .docify-report td { padding: 10px 14px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
          </style>

          <!-- Cover -->
          <div style="background:${color}; color:#fff; padding:60px 48px;">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:3px; opacity:0.75; margin-bottom:16px;">${data.brand && data.brand.company ? data.brand.company : 'Report'}</div>
            <div style="font-size:36px; font-weight:900; line-height:1.2; margin-bottom:16px;">${data.title || 'Report Title'}</div>
            <div style="font-size:14px; opacity:0.8;">${data.date || new Date().toLocaleDateString()} ${data.author ? '· ' + data.author : ''}</div>
          </div>

          <div style="padding: 40px 48px;">
            <!-- Summary -->
            ${data.summary ? `<div style="background:#f0fdf4; border-left:4px solid ${color}; padding:16px 20px; margin-bottom:32px; border-radius:0 8px 8px 0; font-size:14px; color:#444; line-height:1.7;"><strong>Executive Summary:</strong> ${data.summary}</div>` : ''}

            <!-- Sections -->
            ${(data.sections || []).map(section => `
              <h2>${section.title}</h2>
              <p>${section.content}</p>
              ${section.table ? `
                <table>
                  <thead><tr>${section.table.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
                  <tbody>${section.table.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
              ` : ''}
            `).join('')}

            <!-- Conclusion -->
            ${data.conclusion ? `<h2>Conclusion</h2><p>${data.conclusion}</p>` : ''}
          </div>
        </div>
      `;
    },

    proposal: (data) => {
      const color = (data.brand && data.brand.color) || '#dc2626';
      return `
        <div class="docify-doc docify-proposal" style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 780px; margin: 0 auto; background: #fff; color: #111;">
          <style>
            .docify-proposal h2 { font-size: 18px; font-weight: 700; color: ${color}; margin: 32px 0 12px; }
            .docify-proposal p { font-size: 14px; line-height: 1.8; color: #444; }
          </style>

          <!-- Header -->
          <div style="background:${color}; color:#fff; padding:60px 48px;">
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:3px; opacity:0.75; margin-bottom:12px;">Business Proposal</div>
            <div style="font-size:36px; font-weight:900; line-height:1.2;">${data.title || 'Proposal Title'}</div>
            <div style="margin-top:24px; font-size:14px; opacity:0.8;">
              Prepared for: <strong>${data.client || 'Client'}</strong><br>
              By: <strong>${(data.brand && data.brand.company) || 'Your Company'}</strong><br>
              Date: ${data.date || new Date().toLocaleDateString()}
            </div>
          </div>

          <div style="padding:40px 48px;">
            ${data.overview ? `<h2>Overview</h2><p>${data.overview}</p>` : ''}
            ${data.problem ? `<h2>The Problem</h2><p>${data.problem}</p>` : ''}
            ${data.solution ? `<h2>Our Solution</h2><p>${data.solution}</p>` : ''}

            ${data.deliverables && data.deliverables.length ? `
              <h2>Deliverables</h2>
              <ul style="padding-left:20px;">
                ${data.deliverables.map(d => `<li style="font-size:14px; color:#444; margin-bottom:6px;">${d}</li>`).join('')}
              </ul>
            ` : ''}

            ${data.timeline ? `<h2>Timeline</h2><p>${data.timeline}</p>` : ''}
            ${data.budget ? `
              <h2>Investment</h2>
              <div style="background:#fff5f5; border:2px solid ${color}; padding:24px; border-radius:8px; text-align:center;">
                <div style="font-size:13px; color:#888; text-transform:uppercase; letter-spacing:1px;">Total Investment</div>
                <div style="font-size:40px; font-weight:900; color:${color}; margin:8px 0;">${data.budget}</div>
              </div>
            ` : ''}

            ${data.next_steps ? `<h2>Next Steps</h2><p>${data.next_steps}</p>` : ''}
          </div>
        </div>
      `;
    }
  };

  // ─── EXPORT ENGINES ───────────────────────────────────────────────────────

  function exportHTML(html, filename) {
    const full = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title></head><body style="margin:0; background:#e5e7eb; padding:32px;">${html}</body></html>`;
    const blob = new Blob([full], { type: 'text/html' });
    triggerDownload(blob, filename + '.html');
  }

  function exportPDF(html, filename) {
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${filename}</title><style>body{margin:0;padding:0;background:#fff;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>${html}<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};}<\/script></body></html>`);
    win.document.close();
  }

  function exportPNG(html, filename) {
    if (typeof html2canvas !== 'undefined') {
      const div = document.createElement('div');
      div.innerHTML = html;
      div.style.position = 'absolute';
      div.style.left = '-9999px';
      document.body.appendChild(div);
      html2canvas(div.firstElementChild).then(canvas => {
        canvas.toBlob(blob => {
          triggerDownload(blob, filename + '.png');
          document.body.removeChild(div);
        });
      });
    } else {
      console.warn('Docify: html2canvas not loaded. Add <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"> for PNG export.');
      exportHTML(html, filename);
    }
  }

  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ─── CORE API ─────────────────────────────────────────────────────────────

  function DocifyBuilder(templateName) {
    this._template = templateName;
    this._data = {};
    this._filename = templateName;
  }

  DocifyBuilder.prototype.data = function(obj) {
    this._data = obj || {};
    if (obj && obj.client) this._filename = obj.client.replace(/\s+/g, '_') + '_' + this._template;
    if (obj && obj.name) this._filename = obj.name.replace(/\s+/g, '_') + '_' + this._template;
    return this;
  };

  DocifyBuilder.prototype.filename = function(name) {
    this._filename = name;
    return this;
  };

  DocifyBuilder.prototype.render = function() {
    const tpl = templates[this._template];
    if (!tpl) throw new Error('Docify: Unknown template "' + this._template + '". Available: ' + Object.keys(templates).join(', '));
    return tpl(this._data);
  };

  DocifyBuilder.prototype.preview = function(selector) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) throw new Error('Docify: Preview element not found: ' + selector);
    el.innerHTML = this.render();
    return this;
  };

  DocifyBuilder.prototype.export = function(format) {
    const html = this.render();
    const fmt = (format || 'pdf').toLowerCase();
    if (fmt === 'html') exportHTML(html, this._filename);
    else if (fmt === 'pdf') exportPDF(html, this._filename);
    else if (fmt === 'png') exportPNG(html, this._filename);
    else throw new Error('Docify: Unknown format "' + format + '". Use: pdf, html, png');
    return this;
  };

  // ─── PUBLIC API ───────────────────────────────────────────────────────────

  const Docify = {
    version: '1.0.0',

    use: function(templateName) {
      return new DocifyBuilder(templateName);
    },

    templates: Object.keys(templates),

    // Convenience: one-liner generate
    generate: function(templateName, data, format) {
      return Docify.use(templateName).data(data).export(format || 'pdf');
    }
  };

  return Docify;
}));
