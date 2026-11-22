const disposable = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'yopmail.com',
  'getnada.com',
  'throwawaymail.com'
]);
export const isDisposableEmail = (email: string) =>
  disposable.has(email.toLowerCase().split('@').at(-1) ?? '');
