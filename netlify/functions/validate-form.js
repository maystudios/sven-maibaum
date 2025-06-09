export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { name, email, message, 'g-recaptcha-response': token } = data;
  if (!name || !email || !message || !token) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const secret = process.env.RECAPTCHA_SECRET;
  try {
    const verifyResp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });
    const verify = await verifyResp.json();
    if (!verify.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'reCAPTCHA validation failed' }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify reCAPTCHA' }),
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    const formRes = await fetch('https://formspree.io/f/xvgrpazj', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    if (!formRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Form submission failed' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Network error' }),
    };
  }
}
