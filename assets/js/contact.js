// To send messages without opening the visitor's email app, create a form at
// https://formspree.io and paste its endpoint here, e.g. 'https://formspree.io/f/abcdwxyz'.
const FORM_ENDPOINT = '';
const EMAIL = 'Nam.NL@protonmail.com';

export function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const setStatus = (text, kind = '') => { status.textContent = text; status.dataset.kind = kind; };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      setStatus('Please fill in your name, a valid email and a message.', 'error');
      form.querySelector(':invalid').focus();
      return;
    }
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // honeypot filled in: a bot

    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.get('name')}`);
      const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} <${data.get('email')}>`);
      location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      setStatus('Opening your email app…');
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    setStatus('Sending…');
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      form.classList.remove('was-validated');
      setStatus('Thanks, your message has been sent.', 'success');
    } catch {
      setStatus(`Something went wrong. Please email ${EMAIL} instead.`, 'error');
    } finally {
      button.disabled = false;
    }
  });
}
