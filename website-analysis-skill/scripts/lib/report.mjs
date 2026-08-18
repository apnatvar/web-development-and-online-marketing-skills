import path from 'node:path';
import { ensureDirectory, writeText } from './fs-utils.mjs';

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function markdownValue(value) {
  return String(value ?? 'Not recorded').replace(/\r?\n/g, ' ');
}

function titleCase(value) {
  return String(value).replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function score(value) {
  return Number.isFinite(value) ? Math.round(value) : '—';
}

function findingMarkdown(finding) {
  return `### ${finding.title}\n\n` +
    `- **Issue ID:** \`${finding.id}\`\n` +
    `- **Category:** ${markdownValue(finding.category)}\n` +
    `- **Affected page:** ${markdownValue(finding.affectedPage)}\n` +
    `- **Severity / confidence:** ${finding.severity} / ${finding.confidence}\n` +
    `- **Priority / effort:** ${finding.priorityGroup} / ${finding.effort}\n` +
    `- **Change type:** ${finding.changeType}\n` +
    `- **Measurement class:** ${finding.measurementClass}\n` +
    `- **Evidence:** ${markdownValue(finding.evidence)}\n` +
    `- **Evidence source:** ${markdownValue(finding.evidenceSource)}\n` +
    `- **Repository access required:** ${finding.repositoryAccessRequired ? 'Yes' : 'No'}\n\n` +
    `**Why it matters to visitors:** ${markdownValue(finding.userImpact)}\n\n` +
    `**SEO impact:** ${markdownValue(finding.seoImpact)}\n\n` +
    `**Conversion impact:** ${markdownValue(finding.conversionImpact)}\n\n` +
    `**Technical explanation:** ${markdownValue(finding.technicalExplanation)}\n\n` +
    `**In plain language:** ${markdownValue(finding.plainLanguageExplanation)}\n\n` +
    `**Recommended fix:** ${markdownValue(finding.recommendedFix)}\n\n` +
    `**Implementation guidance:** ${markdownValue(finding.implementationGuidance)}\n\n` +
    `**Expected result:** ${markdownValue(finding.expectedResult)}\n\n` +
    `**How to verify:** ${markdownValue(finding.verificationMethod)}\n`;
}

function lighthouseMarkdown(summaries) {
  if (!summaries?.length) return 'Lighthouse was not run for this audit. See Limitations.\n';
  const rows = summaries.map((item) => {
    const categories = item.summary.categories;
    return `| ${item.summary.url} | ${score(categories.performance?.scorePercent)} | ${score(categories.accessibility?.scorePercent)} | ${score(categories['best-practices']?.scorePercent)} | ${score(categories.seo?.scorePercent)} | ${item.summary.runs} |`;
  });
  return `| URL | Performance | Accessibility | Best practices | SEO | Runs |\n|---|---:|---:|---:|---:|---:|\n${rows.join('\n')}\n\n` +
    `Scores are medians. Performance measurements are variable; standard throttling improves comparability but does not make them deterministic. Raw run files are listed under Reproducibility.\n`;
}

export function renderMarkdown(report) {
  const counts = Object.fromEntries(['critical', 'high', 'medium', 'low', 'informational'].map((level) => [level, report.findings.filter((item) => item.severity === level).length]));
  const intent = report.intent
    ? Object.entries(report.intent).map(([key, value]) => `- **${titleCase(key)}:** ${Array.isArray(value) ? value.join(', ') || 'None supplied' : markdownValue(value)}`).join('\n')
    : 'Not collected: technical-only audits do not require website intent.';
  const pageRows = report.pages.map((page) => `| ${markdownValue(page.label)} | ${markdownValue(page.source)} | ${page.status ?? 'source inspection'} |`).join('\n');
  const prioritySections = ['fix first', 'fix next', 'improve later', 'monitor'].map((group) => {
    const items = report.findings.filter((finding) => finding.priorityGroup === group);
    return `### ${titleCase(group)}\n\n${items.length ? items.map((item) => `- [${item.title}](#${item.id}) — ${item.severity}, ${item.confidence}, ${item.effort} effort`).join('\n') : 'No findings.'}`;
  }).join('\n\n');
  const findingSections = report.findings.map((finding) => `<a id="${finding.id}"></a>\n\n${findingMarkdown(finding)}`).join('\n\n');
  const limitations = report.limitations.length ? report.limitations.map((item) => `- ${markdownValue(item)}`).join('\n') : '- No additional limitations recorded.';
  const rawPaths = report.reproducibility.rawResultPaths?.length ? report.reproducibility.rawResultPaths.map((item) => `- \`${item}\``).join('\n') : '- No Lighthouse raw files (Lighthouse was not run).';
  const staleWarning = report.seoKnowledge.warning ? `\n> Warning: ${report.seoKnowledge.warning}\n` : '';
  return `# Website Tech & Content Analysis\n\n` +
    `- **Mode:** ${report.mode}\n- **Audit date:** ${report.auditDate}\n- **Input:** ${report.input.type} — ${markdownValue(report.input.target)}\n- **Report version:** ${report.reportVersion}\n\n` +
    `## Summary\n\n${report.summary}\n\n` +
    `| Critical | High | Medium | Low | Informational |\n|---:|---:|---:|---:|---:|\n| ${counts.critical} | ${counts.high} | ${counts.medium} | ${counts.low} | ${counts.informational} |\n\n` +
    `## SEO knowledge status\n\nVerified **${report.seoKnowledge.lastVerified}** (${report.seoKnowledge.ageDays} days old; status: ${report.seoKnowledge.status}). Knowledge version: ${report.seoKnowledge.knowledgeVersion}.${staleWarning}\n` +
    `## Audit configuration\n\n- **Selected modules:** ${report.reproducibility.modules.join(', ')}\n- **Build mode:** ${report.reproducibility.buildMode}\n- **Repository commit:** ${report.reproducibility.repositoryCommit ?? 'Not available'}\n- **Lighthouse standard:** ${report.reproducibility.lighthouseBaseline.lighthouseVersion}; Chrome baseline ${report.reproducibility.lighthouseBaseline.chromeVersion}; ${report.reproducibility.lighthouseBaseline.deviceProfile}; ${report.reproducibility.lighthouseBaseline.numberOfRuns} runs; ${report.reproducibility.lighthouseBaseline.throttlingMethod} throttling\n\n` +
    `## Website intent\n\n${intent}\n\n` +
    `## Tested pages\n\n| Page | Evidence source | HTTP status |\n|---|---|---:|\n${pageRows}\n\n` +
    `## Prioritised remediation plan\n\n${prioritySections}\n\n` +
    `## Lighthouse results\n\n${lighthouseMarkdown(report.lighthouse)}\n\n` +
    `## Findings\n\n${findingSections || 'No issues were identified by the modules that ran. This is not a guarantee that the site has no problems.'}\n\n` +
    `## Reproducibility\n\n- **Node:** ${report.reproducibility.nodeVersion}\n- **Lighthouse runtime(s):** ${report.reproducibility.lighthouseVersions.join(', ') || 'Not run'}\n- **Chrome runtime(s):** ${report.reproducibility.chromeVersions.join(', ') || 'Not run'}\n- **Page selection:** ${report.reproducibility.pageSelection}\n- **Median rule:** ${report.reproducibility.medianRule}\n\nRaw Lighthouse results:\n\n${rawPaths}\n\n` +
    `## Limitations\n\n${limitations}\n`;
}

function findingHtml(finding) {
  const rows = [
    ['Category', finding.category], ['Affected page', finding.affectedPage], ['Severity / confidence', `${finding.severity} / ${finding.confidence}`],
    ['Priority / effort', `${finding.priorityGroup} / ${finding.effort}`], ['Change type', finding.changeType], ['Measurement class', finding.measurementClass],
    ['Evidence source', finding.evidenceSource], ['Repository access required', finding.repositoryAccessRequired ? 'Yes' : 'No'],
  ];
  return `<details class="finding ${escapeHtml(finding.severity)}" id="${escapeHtml(finding.id)}"><summary><span class="badge">${escapeHtml(finding.severity)}</span> ${escapeHtml(finding.title)} <small>${escapeHtml(finding.affectedPage)}</small></summary><div class="detail">` +
    `<dl>${rows.map(([term, value]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(value)}</dd>`).join('')}</dl>` +
    `<h4>Evidence</h4><p id="evidence-${escapeHtml(finding.id)}">${escapeHtml(finding.evidence)}</p>` +
    `<h4>Why it matters</h4><p>${escapeHtml(finding.userImpact)}</p><p><strong>SEO:</strong> ${escapeHtml(finding.seoImpact)}</p><p><strong>Conversion:</strong> ${escapeHtml(finding.conversionImpact)}</p>` +
    `<h4>Explanation</h4><p>${escapeHtml(finding.technicalExplanation)}</p><p class="plain"><strong>In plain language:</strong> ${escapeHtml(finding.plainLanguageExplanation)}</p>` +
    `<h4>Repair</h4><p><strong>Fix:</strong> ${escapeHtml(finding.recommendedFix)}</p><p><strong>Implementation:</strong> ${escapeHtml(finding.implementationGuidance)}</p>` +
    `<p><strong>Expected result:</strong> ${escapeHtml(finding.expectedResult)}</p><p><strong>Verify:</strong> ${escapeHtml(finding.verificationMethod)}</p>` +
    `<p><a href="#evidence-${escapeHtml(finding.id)}">Link to evidence</a></p></div></details>`;
}

function lighthouseHtml(items) {
  if (!items?.length) return '<p>Lighthouse was not run. See limitations.</p>';
  return `<div class="scores">${items.map(({ summary }) => `<article><h3>${escapeHtml(summary.url)}</h3>${Object.entries(summary.categories).map(([name, category]) => {
    const value = score(category.scorePercent);
    return `<div class="score"><span>${escapeHtml(titleCase(name))}</span><div><i style="width:${Number.isFinite(value) ? value : 0}%"></i></div><strong>${value}</strong></div>`;
  }).join('')}<p>${summary.runs} runs · median · ${escapeHtml(summary.configuration.throttlingMethod ?? 'unknown')} throttling</p></article>`).join('')}</div>`;
}

export function renderHtml(report) {
  const counts = Object.fromEntries(['critical', 'high', 'medium', 'low', 'informational'].map((level) => [level, report.findings.filter((item) => item.severity === level).length]));
  const intent = report.intent ? `<dl>${Object.entries(report.intent).map(([key, value]) => `<dt>${escapeHtml(titleCase(key))}</dt><dd>${escapeHtml(Array.isArray(value) ? value.join(', ') || 'None supplied' : value)}</dd>`).join('')}</dl>` : '<p>Not collected for technical-only mode.</p>';
  const priority = ['fix first', 'fix next', 'improve later', 'monitor'].map((group) => `<section><h3>${escapeHtml(titleCase(group))}</h3><ol>${report.findings.filter((item) => item.priorityGroup === group).map((item) => `<li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.title)}</a> <small>${escapeHtml(item.severity)} · ${escapeHtml(item.effort)} effort</small></li>`).join('') || '<li>None</li>'}</ol></section>`).join('');
  const limitations = report.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>No additional limitations recorded.</li>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Website Tech &amp; Content Analysis</title><style>
  :root{--ink:#172033;--muted:#5f6b7a;--line:#d9e0e8;--paper:#fff;--bg:#f4f7fa;--accent:#2857d6;--critical:#a61b1b;--high:#c34a18;--medium:#a16a00;--low:#316a57;--info:#53657a}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}main{max-width:1120px;margin:auto;padding:32px 20px 80px}header{background:linear-gradient(135deg,#142247,#2857d6);color:#fff;padding:38px;border-radius:18px;box-shadow:0 12px 35px #14224722}h1{margin:.1em 0;font-size:clamp(2rem,5vw,3.5rem)}h2{margin-top:2.2em;border-bottom:1px solid var(--line);padding-bottom:.35em}a{color:var(--accent)}.meta{display:flex;gap:18px;flex-wrap:wrap}.meta span{background:#ffffff1d;padding:6px 10px;border-radius:20px}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin:20px 0}.card,.scores article,.plan section{background:var(--paper);padding:18px;border:1px solid var(--line);border-radius:12px}.card strong{display:block;font-size:2rem}.warning{background:#fff2c7;border-left:5px solid #d49400;padding:12px 16px}.plan{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}.finding{background:var(--paper);border:1px solid var(--line);border-left:6px solid var(--info);border-radius:10px;margin:12px 0}.finding.critical{border-left-color:var(--critical)}.finding.high{border-left-color:var(--high)}.finding.medium{border-left-color:var(--medium)}.finding.low{border-left-color:var(--low)}summary{cursor:pointer;padding:18px;font-weight:700}summary small{display:block;color:var(--muted);font-weight:400;margin-left:54px}.badge{display:inline-block;color:#fff;background:var(--info);padding:2px 8px;border-radius:10px;font-size:.72rem;text-transform:uppercase}.critical .badge{background:var(--critical)}.high .badge{background:var(--high)}.medium .badge{background:var(--medium)}.low .badge{background:var(--low)}.detail{padding:0 20px 22px}.plain{background:#edf4ff;padding:12px;border-radius:8px}dl{display:grid;grid-template-columns:minmax(150px,240px) 1fr;gap:5px 15px}dt{font-weight:700}dd{margin:0}.scores{display:grid;gap:14px}.score{display:grid;grid-template-columns:150px 1fr 45px;align-items:center;gap:10px}.score div{height:10px;background:#e5eaf0;border-radius:10px;overflow:hidden}.score i{display:block;height:100%;background:var(--accent)}table{width:100%;border-collapse:collapse;background:var(--paper)}th,td{padding:10px;border:1px solid var(--line);text-align:left}@media(max-width:650px){header{padding:24px}dl{grid-template-columns:1fr}.score{grid-template-columns:110px 1fr 38px}}
  </style></head><body><main><header><p>Website Tech &amp; Content Analysis · report ${escapeHtml(report.reportVersion)}</p><h1>${escapeHtml(titleCase(report.mode))} audit</h1><div class="meta"><span>${escapeHtml(report.auditDate)}</span><span>${escapeHtml(report.input.type)}</span><span>SEO verified ${escapeHtml(report.seoKnowledge.lastVerified)}</span></div></header>
  <h2>Summary</h2><p>${escapeHtml(report.summary)}</p><div class="cards">${Object.entries(counts).map(([level, count]) => `<div class="card"><strong>${count}</strong>${escapeHtml(titleCase(level))}</div>`).join('')}</div>${report.seoKnowledge.warning ? `<p class="warning">${escapeHtml(report.seoKnowledge.warning)}</p>` : ''}
  <h2>Audit configuration</h2><dl><dt>Input</dt><dd>${escapeHtml(report.input.target)}</dd><dt>Modules</dt><dd>${escapeHtml(report.reproducibility.modules.join(', '))}</dd><dt>Lighthouse baseline</dt><dd>${escapeHtml(`${report.reproducibility.lighthouseBaseline.lighthouseVersion}; Chrome ${report.reproducibility.lighthouseBaseline.chromeVersion}; ${report.reproducibility.lighthouseBaseline.deviceProfile}; ${report.reproducibility.lighthouseBaseline.numberOfRuns} runs`)}</dd><dt>Repository commit</dt><dd>${escapeHtml(report.reproducibility.repositoryCommit ?? 'Not available')}</dd></dl>
  <h2>Website intent</h2>${intent}<h2>Tested pages</h2><table><thead><tr><th>Page</th><th>Source</th><th>Status</th></tr></thead><tbody>${report.pages.map((page) => `<tr><td>${escapeHtml(page.label)}</td><td>${escapeHtml(page.source)}</td><td>${escapeHtml(page.status ?? 'source inspection')}</td></tr>`).join('')}</tbody></table>
  <h2>Prioritised remediation plan</h2><div class="plan">${priority}</div><h2>Lighthouse results</h2>${lighthouseHtml(report.lighthouse)}
  <h2>Findings</h2>${report.findings.map(findingHtml).join('') || '<p>No issues were identified by the modules that ran. This is not a guarantee that the site has no problems.</p>'}
  <h2>Limitations</h2><ul>${limitations}</ul><h2>Reproducibility</h2><p>Node ${escapeHtml(report.reproducibility.nodeVersion)}. Lighthouse: ${escapeHtml(report.reproducibility.lighthouseVersions.join(', ') || 'not run')}. Chrome: ${escapeHtml(report.reproducibility.chromeVersions.join(', ') || 'not run')}.</p><p>Standardized simulated throttling improves comparability but does not make performance measurements deterministic. Raw results are retained separately.</p>
  </main></body></html>`;
}

export async function writeReport(report, outputDirectory, format) {
  const reportsDirectory = await ensureDirectory(path.join(outputDirectory, 'reports'));
  const filename = format === 'html' ? 'audit.html' : 'audit.md';
  const target = path.join(reportsDirectory, filename);
  await writeText(target, format === 'html' ? renderHtml(report) : renderMarkdown(report));
  return target;
}
