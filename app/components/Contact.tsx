const socialLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter / X", href: "https://twitter.com" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-32 border-t border-wire">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-neon text-xs tracking-[0.35em] uppercase mb-6">
            05. Contact
          </p>
          <h2 className="font-display font-bold text-snow leading-tight mb-6"
            style={{ fontSize: "clamp(2.75rem, 6vw, 4rem)" }}
          >
            Let&apos;s build
            <br />
            something.
          </h2>
          <p className="text-mist text-lg leading-relaxed mb-10">
            I&apos;m currently open to new opportunities. If you&apos;re building
            something in fintech, payments, or distributed systems —
            I&apos;d love to talk.
          </p>

          <a
            href="mailto:alex.mercer@example.com"
            className="inline-flex items-center gap-3 text-neon font-display text-xl lg:text-2xl font-semibold hover:opacity-75 transition-opacity group"
          >
            alex.mercer@example.com
            <svg
              className="w-5 h-5 group-hover:translate-x-1.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>

          {/* Social links */}
          <div className="flex gap-7 mt-12">
            {socialLinks.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-mist hover:text-snow transition-colors border-b border-transparent hover:border-snow pb-0.5"
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 mt-24 pt-8 border-t border-wire">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-mono text-xs text-wire">
            Designed &amp; built by Alex Mercer
          </p>
          <p className="font-mono text-xs text-wire">
            © 2025 · All rights reserved
          </p>
        </div>
      </div>
    </section>
  );
}
