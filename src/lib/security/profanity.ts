const blockedTerms = ['putain', 'merde', 'connard', 'salope', 'fuck', 'shit', 'bitch', 'asshole'];
export function isPublicNameAllowed(name: string) {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return !blockedTerms.some((term) => normalized.includes(term));
}
