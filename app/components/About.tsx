const highlights = [
  { label: "Location", value: "Lagos, Nigeria" },
  { label: "Experience", value: "5+ Years" },
  { label: "Focus", value: "Backend · Fintech" },
  { label: "Status", value: "Open to Offers" },
];

export default function About() {
  return (
    <section id="about" className="py-28 border-t border-wire">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: heading */}
          <div>
            <p className="font-mono text-neon text-xs tracking-[0.35em] uppercase mb-5">
              01. About
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-snow leading-tight">
              The engineer
              <br />
              behind the code.
            </h2>
          </div>

          {/* Right: bio */}
          <div className="flex flex-col gap-5 text-mist text-base leading-relaxed">
            <p>
              With 4+ years of Experience, I specialize in building Fintech systems
              that are data-intensive.         
              I design and develop robust backend APIs that power transactions and payments systems 
              with a good eeye for quality and clean code principles.
              I pay attention to details and adhere to industry best practices
               like ACID compliance, data integrity, and security.
            </p>
            <p>
              I have deep expertise in wallet systems , enforcing double-entry ledger, 
              idempotency, asynchronous processing to handle high loads without downtime while maintaining security.
              I ensure reliability of systems through unit Tests, E2E testing for full application flows and 
            </p>
            <p>
              When I&apos;m not thinking about idempotency keys or row-level
              locking, I work on the frontend too. React feels different when
              you&apos;ve built the API it&apos;s calling.
            </p>

            {/* Highlight cards */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              {highlights.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-surface border border-wire rounded-xl p-4"
                >
                  <p className="font-mono text-xs text-mist/50 mb-1.5 tracking-widest uppercase">
                    {label}
                  </p>
                  <p className="text-snow font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
