import { useState } from 'react';
import Button from '../component/Buttom';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // UI-only form submission handling for this frontend demo.
    alert('Thanks for reaching out! Our team will get back to you shortly.');
  };

  return (
    <div className="container page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Let’s talk beauty.</h1>
        </div>
      </div>

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field-grid">
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required />
            </label>
          </div>

          <label>
            Message
            <textarea rows="6" name="message" value={form.message} onChange={handleChange} required />
          </label>

          <Button type="submit">Submit</Button>
        </form>

        <aside className="contact-info-card">
          <h3>Visit or connect</h3>
          <ul>
            <li>
              <strong>Email:</strong> hello@nailatelier.in
            </li>
            <li>
              <strong>Phone:</strong> +91 98765 43210
            </li>
            <li>
              <strong>Address:</strong> 12 Rose Lane, Mumbai, India
            </li>
            <li>
              <strong>Business Hours:</strong> Mon–Sat, 10:00 AM–7:00 PM
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default Contact;
