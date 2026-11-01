function offerFooterTagSpecs(status) {
  if (typeof status !== 'string' || !status.trim()) throw new Error('Footer readiness text is missing.');
  return status.split(/\s*\u00b7\s*/).map(part => {
    const label = part.trim();
    if (/^(?:\d+|Required) fields? missing$/i.test(label) || /^\d+ details? to check$/i.test(label)) return { label, tone: 'warning' };
    if (/^\d+ errors? to fix$/i.test(label) || /^Needs correction$/i.test(label)) return { label, tone: 'error' };
    if (/^(Everything is ready|Ready to send|Ready|All details complete|Complete|Candidate & role ready)$/i.test(label)) return { label, tone: 'success' };
    if (/^(Draft|Editing|Not started|In progress|Not required)$/i.test(label)) return { label, tone: 'info' };
    throw new Error('Unrecognized footer readiness text: ' + label);
  });
}

function offerFooterAlertSpecs(status) {
  return offerFooterTagSpecs(status).filter(tag => tag.tone === 'warning' || tag.tone === 'error');
}
