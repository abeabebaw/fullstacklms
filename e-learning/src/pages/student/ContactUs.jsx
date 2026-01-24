import React from "react";
import Footer from "../../components/student/Footer";

const ContactUs = () => {
  const [form, setForm] = React.useState({ firstName: "", lastName: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState("idle"); // idle | loading | success | error

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 900);
  };

  const onChange = (key) => (ev) => setForm((p) => ({ ...p, [key]: ev.target.value }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50/40 to-white text-gray-800">

      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-cyan-50/60 to-white" />
      <div className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.13),rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl w-full mx-auto px-6 md:px-10 lg:px-16 py-10 md:py-14 flex-1">
        <div className="max-w-3xl flex flex-col items-center text-center mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full p-4 shadow-lg mb-2">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 10.34V6.5A2.5 2.5 0 0018.5 4h-13A2.5 2.5 0 003 6.5v11A2.5 2.5 0 005.5 20h13a2.5 2.5 0 002.5-2.5v-3.84l-9 4.5a1 1 0 01-.9 0l-9-4.5" /></svg>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-700 bg-blue-100 px-3 py-1 rounded-full">We’d love to help</span>
          <h1 className="mt-4 text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent leading-tight">Get in touch with our team</h1>
          <p className="mt-3 text-gray-600">Have questions or feedback? Fill out the form and we’ll get back to you within 1–2 business days.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="order-2 xl:order-1 space-y-4">
            <InfoCard title="Email" text="support@biruhamiro-elearning.com">
              <IconMail />
            </InfoCard>
            <InfoCard title="Phone" text="+251 9 28113706">
              <IconPhone />
            </InfoCard>
            <InfoCard title="Office" text="Ethipia,bahrdar">
              <IconMapPin />
            </InfoCard>
            <div className="p-5 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white shadow-md">
              <h3 className="font-semibold text-blue-700">Office Hours</h3>
              <p className="mt-1 text-sm text-gray-600">Mon–Fri, 2:00–11:00 local time</p>
            </div>
          </div>

          <div className="order-1 xl:order-2 xl:col-span-2">
            <form onSubmit={onSubmit} noValidate className="bg-gradient-to-br from-white/90 via-blue-50/80 to-cyan-50/80 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-blue-100 shadow-2xl shadow-blue-100/30 space-y-5 animate-fade-in-up">
              {status === "success" ? (
                <div className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-green-100 to-green-50 border border-green-200 p-4 animate-fade-in-up">
                  <span className="mt-0.5 text-green-600"><IconCheck /></span>
                  <div>
                    <p className="font-semibold text-green-800">Message sent successfully</p>
                    <p className="text-sm text-green-700">Thanks for reaching out. We’ll reply to {form.email} soon.</p>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="First Name" error={errors.firstName}>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={onChange("firstName")}
                    aria-invalid={Boolean(errors.firstName)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="abebaw"
                    required
                  />
                </Field>
                <Field label="Last Name" error={errors.lastName}>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={onChange("lastName")}
                    aria-invalid={Boolean(errors.lastName)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="solomon"
                    required
                  />
                </Field>
              </div>

              <Field label="Email" error={errors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange("email")}
                  aria-invalid={Boolean(errors.email)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </Field>

              <Field label="Subject" error={errors.subject}>
                <input
                    type="text"
                    value={form.subject}
                    onChange={onChange("subject")}
                    aria-invalid={Boolean(errors.subject)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="How can we help?"
                    required
                />
              </Field>

              <Field label="Message" error={errors.message}>
                <textarea
                  rows="6"
                  value={form.message}
                  onChange={onChange("message")}
                  aria-invalid={Boolean(errors.message)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-y"
                  placeholder="Write your message here..."
                  required
                />
              </Field>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">We typically respond within 24–48 hours.</p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center gap-2 justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Spinner /> Sending
                    </>
                  ) : (
                    <>Send Message</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        
      </div>

      <footer className="mt-auto border-t border-gray-200 bg-gray-50">
        <Footer />
      </footer>
    </div>
  );
};

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
  </div>
);

const InfoCard = ({ title, text, children }) => (
  <div className="p-5 rounded-xl border border-gray-200 bg-white/70 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className="shrink-0 text-blue-600">{children}</div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-700 mt-0.5">{text}</p>
      </div>
    </div>
  </div>
);

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
  </svg>
);

const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.94 6.34l6.32 4.21a2 2 0 002.08 0l6.32-4.21A2 2 0 0016.99 5H3.01a2 2 0 00-.07 1.34z"/><path d="M18 8.12l-6.32 4.21a4 4 0 01-4.36 0L1 8.12V14a2 2 0 002 2h14a2 2 0 002-2V8.12z"/></svg>
);

const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.086c.95 0 1.786.62 2.06 1.53l.772 2.572a2.25 2.25 0 01-.52 2.165l-1.21 1.21a15.047 15.047 0 007.2 7.2l1.21-1.21a2.25 2.25 0 012.165-.52l2.572.772a2.25 2.25 0 011.53 2.06V19.5a2.25 2.25 0 01-2.25 2.25h-.75C8.52 21.75 2.25 15.48 2.25 7.5v-.75z"/></svg>
);

const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.54 22.35a.75.75 0 00.92 0C14.86 20.57 20 16.2 20 11a8 8 0 10-16 0c0 5.2 5.14 9.57 7.54 11.35zM12 13a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
);

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.42 0l-3.25-3.25a1 1 0 111.42-1.42l2.54 2.54 6.54-6.54a1 1 0 011.42 0z" clipRule="evenodd"/></svg>
);

export default ContactUs;
