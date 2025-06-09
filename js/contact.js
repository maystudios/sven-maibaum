const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const resp = await fetch('/.netlify/functions/validate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        alert('Nachricht erfolgreich gesendet.');
        form.reset();
      } else {
        const data = await resp.json();
        alert(data.error || 'Fehler beim Senden der Nachricht.');
      }
    } catch (err) {
      alert('Netzwerkfehler. Bitte versuchen Sie es später erneut.');
    }
  });
}
