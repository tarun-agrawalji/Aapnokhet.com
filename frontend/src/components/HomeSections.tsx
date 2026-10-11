import Link from "next/link";
import { Wordmark } from "@/components/Navbar";

const STEPS = [
  {
    title: "Open a business account",
    body: "Tell us your kitchen's name, GSTIN and FSSAI licence. We check them within a working day and set up your credit limit.",
  },
  {
    title: "Order by 10 PM",
    body: "Pick pack sizes and quantities. Prices drop on their own when you cross a bulk slab, and you see the GST before you confirm.",
  },
  {
    title: "Receive by 6 AM",
    body: "Our van reaches your back door before prep starts. Dairy travels chilled. You share a one-time code with the driver to sign for it.",
  },
  {
    title: "Pay within 15 days",
    body: "Each order comes with a GST invoice. Settle by bank transfer or UPI whenever suits you inside the credit period.",
  },
];

export function HowOrdering() {
  return (
    <section id="ordering" className="border-t border-line">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-24 sm:px-6 md:grid-cols-12 lg:px-10 lg:py-32">
        <div className="md:col-span-4">
          <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]">How ordering works</h2>
          <p className="mt-5 max-w-[34ch] text-[16px] leading-relaxed text-ink-2">
            The same routine every day, built around the hours a kitchen keeps.
          </p>
        </div>
        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 md:col-span-8">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t border-ink pt-5">
              <span className="font-display tabular text-[15px] text-muted">{i + 1}</span>
              <h3 className="mt-3 text-[19px] font-medium text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const REPORT = [
  { test: "Moisture", result: "11.2%", limit: "13.0% max" },
  { test: "Total ash", result: "1.38%", limit: "2.0% max" },
  { test: "Acid insoluble ash", result: "0.06%", limit: "0.15% max" },
  { test: "Wet gluten", result: "29.4%", limit: "24.0% min" },
  { test: "Uric acid", result: "14 mg/kg", limit: "100 mg/kg max" },
  { test: "Pesticide residue", result: "None found", limit: "Within FSSAI limits" },
];

export function QualityReport() {
  return (
    <section id="quality" className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1240px] gap-14 px-4 py-24 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-32">
        <div className="lg:col-span-5">
          <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]">
            Every batch is tested before it leaves the warehouse.
          </h2>
          <p className="mt-6 max-w-[44ch] text-[16px] leading-relaxed text-white/70">
            Samples from each lot go to an NABL accredited lab. If a batch fails any test, it never goes on sale. Each product page shows
            the report for the batch you will receive, and older stock always ships first so nothing sits past its best.
          </p>
        </div>

        <figure className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-lg border border-white/15 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-5">
              <div>
                <p className="text-[17px]">Sharbati whole wheat atta, 50 kg</p>
                <p className="mt-1 text-[14px] text-white/55">Batch AK-ATTA-2610-14, tested 8 October 2026</p>
              </div>
              <p className="rounded-full border border-white/30 px-3 py-1 text-[13px]">Passed</p>
            </div>
            <table className="mt-2 w-full text-left text-[14px]">
              <thead>
                <tr className="text-white/50">
                  <th scope="col" className="py-3 font-normal">Test</th>
                  <th scope="col" className="py-3 font-normal">Result</th>
                  <th scope="col" className="hidden py-3 font-normal sm:table-cell">FSSAI limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {REPORT.map((r) => (
                  <tr key={r.test}>
                    <td className="py-3 pr-4">{r.test}</td>
                    <td className="tabular py-3 pr-4">{r.result}</td>
                    <td className="tabular hidden py-3 text-white/55 sm:table-cell">{r.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption className="mt-4 text-[13px] text-white/45">An example of the report attached to every batch.</figcaption>
        </figure>
      </div>
    </section>
  );
}

const VOICES = [
  {
    quote:
      "We fry thousands of puris every morning. Since switching to this atta the texture is the same every day, and rotis stay soft for hours in the banquet warmers.",
    name: "Tarun Rawat",
    place: "Rawat Mishthan Bhandar, Station Road",
  },
  {
    quote:
      "For dum biryani the grain has to stay long and separate. Their aged basmati does, batch after batch, and I can see where each sack came from.",
    name: "Mahendra Singh",
    place: "Head chef, Heritage Haveli, Civil Lines",
  },
  {
    quote:
      "Paneer used to be our biggest headache. Now it arrives cold at 6:30, before the line cooks start, with a clean invoice every week.",
    name: "Pooja Agarwal",
    place: "Purchasing, Spice Cloud Kitchens, 8 outlets",
  },
];

export function Voices() {
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <h2 className="font-display text-[34px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]">From the kitchens we supply</h2>
      <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
        {VOICES.map((v) => (
          <figure key={v.name} className="flex flex-col">
            <blockquote className="font-display text-[20px] leading-[1.45] text-ink">
              &ldquo;{v.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-[14px]">
              <span className="block text-ink">{v.name}</span>
              <span className="block text-muted">{v.place}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-wash">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 py-16 text-[14px] sm:px-6 md:grid-cols-12 lg:px-10">
        <div className="md:col-span-5">
          <Wordmark />
          <p className="mt-4 max-w-[40ch] leading-relaxed text-ink-2">
            Atta, rice, dal and dairy for restaurants, hotels and caterers in Jaipur, sold and delivered from our own warehouse.
          </p>
        </div>
        <div className="md:col-span-3">
          <h3 className="text-ink">Visit or call</h3>
          <address className="mt-3 not-italic leading-relaxed text-ink-2">
            Plot 42, Agro Food Park, RIICO Industrial Area
            <br />
            Jaipur, Rajasthan 302013
          </address>
          <p className="mt-3 text-ink-2">
            <a href="tel:+919829012345" className="hover:text-ink">+91 98290 12345</a>
            <br />
            <a href="mailto:orders@aapnokhet.com" className="hover:text-ink">orders@aapnokhet.com</a>
          </p>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-ink">Shop</h3>
          <ul className="mt-3 space-y-2 text-ink-2">
            <li><Link href="/#supplies" className="hover:text-ink">Supplies</Link></li>
            <li><Link href="/#ordering" className="hover:text-ink">How ordering works</Link></li>
            <li><Link href="/#quality" className="hover:text-ink">Lab testing</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-ink">Account</h3>
          <ul className="mt-3 space-y-2 text-ink-2">
            <li><Link href="/login" className="hover:text-ink">Sign in</Link></li>
            <li><Link href="/login?tab=register" className="hover:text-ink">Open an account</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-2 border-t border-line px-4 py-6 text-[13px] text-muted sm:flex-row sm:px-6 lg:px-10">
        <p>© 2026 AapnoKhet Pure Food Supply Chain Pvt Ltd</p>
        <p>FSSAI licence 12226999000845, GSTIN 08AAACA9876Q1Z2</p>
      </div>
    </footer>
  );
}
