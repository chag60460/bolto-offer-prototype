// The scene shows its final state by default. With motion allowed, it plays a single entrance (under 2 seconds) on load.
if (matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.documentElement.classList.add('will-play');
}

// Early-access sign-up. Demo only: the address never leaves the page.
const form = document.querySelector('.early-form');
if (form) {
  const input = form.querySelector('#early-email');
  const error = form.querySelector('#early-email-error');
  const status = form.querySelector('[data-form-status]');
  const fields = form.querySelector('[data-form-fields]');
  const success = form.querySelector('[data-form-success]');
  const problem = value => {
    if (!value.trim()) return 'Enter your work email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Enter an email like you@company.com.';
    return '';
  };
  const showError = message => {
    error.textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
  };
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true' && !problem(input.value)) showError('');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = problem(input.value);
    if (message) {
      showError(message);
      input.focus();
      return;
    }
    showError('');
    form.querySelector('[data-success-email]').textContent = input.value.trim();
    fields.hidden = true;
    success.hidden = false;
    success.focus();
    status.textContent = `You're on the list. We'll email ${input.value.trim()} on December 1.`;
  });
}
