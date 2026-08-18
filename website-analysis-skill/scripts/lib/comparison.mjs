function findingKey(finding) {
  return `${finding.title}|${finding.affectedPage}`.toLowerCase();
}

function major(version) {
  return String(version ?? '').match(/\d+/)?.[0] ?? null;
}

export function compareAudits(previous, current) {
  const previousFindings = new Map(previous.findings.map((item) => [findingKey(item), item]));
  const currentFindings = new Map(current.findings.map((item) => [findingKey(item), item]));
  const newFindings = [...currentFindings.entries()].filter(([key]) => !previousFindings.has(key)).map(([, item]) => item);
  const resolvedFindings = [...previousFindings.entries()].filter(([key]) => !currentFindings.has(key)).map(([, item]) => item);
  const continuingFindings = [...currentFindings.entries()].filter(([key]) => previousFindings.has(key)).map(([, item]) => item);
  const previousLighthouse = new Map((previous.lighthouse ?? []).map((item) => [item.summary.url, item.summary]));
  const scoreChanges = [];
  for (const item of current.lighthouse ?? []) {
    const before = previousLighthouse.get(item.summary.url);
    if (!before) continue;
    for (const [category, result] of Object.entries(item.summary.categories)) {
      const oldScore = before.categories?.[category]?.scorePercent;
      if (!Number.isFinite(oldScore) || !Number.isFinite(result.scorePercent)) continue;
      scoreChanges.push({ url: item.summary.url, category, before: oldScore, after: result.scorePercent, change: result.scorePercent - oldScore });
    }
  }
  const comparable = JSON.stringify(previous.reproducibility?.lighthouseBaseline) === JSON.stringify(current.reproducibility?.lighthouseBaseline)
    && previous.mode === current.mode;
  const runtimeWarnings = [];
  const oldChrome = previous.reproducibility?.chromeVersions?.[0];
  const newChrome = current.reproducibility?.chromeVersions?.[0];
  if (oldChrome && newChrome && major(oldChrome) !== major(newChrome)) runtimeWarnings.push(`Chrome major changed from ${oldChrome} to ${newChrome}.`);
  return { comparable, runtimeWarnings, newFindings, resolvedFindings, continuingFindings, scoreChanges };
}

export function renderComparisonMarkdown(previous, current, comparison) {
  const list = (items) => items.length ? items.map((item) => `- ${item.title} — ${item.affectedPage}`).join('\n') : '- None';
  const scores = comparison.scoreChanges.length ? `| URL | Category | Before | After | Change |\n|---|---|---:|---:|---:|\n${comparison.scoreChanges.map((item) => `| ${item.url} | ${item.category} | ${Math.round(item.before)} | ${Math.round(item.after)} | ${item.change >= 0 ? '+' : ''}${Math.round(item.change)} |`).join('\n')}` : 'No directly matching Lighthouse URL/category scores.';
  return `# Website audit comparison\n\nPrevious: ${previous.auditDate}  \nCurrent: ${current.auditDate}  \nComparable baseline: ${comparison.comparable ? 'Yes' : 'No'}\n\n${comparison.runtimeWarnings.map((item) => `> Warning: ${item}`).join('\n')}\n\n## New findings\n\n${list(comparison.newFindings)}\n\n## Resolved findings\n\n${list(comparison.resolvedFindings)}\n\n## Continuing findings\n\n${list(comparison.continuingFindings)}\n\n## Lighthouse score changes\n\n${scores}\n`;
}
