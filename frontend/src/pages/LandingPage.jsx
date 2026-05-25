import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const STATS = [
  { value: "12,400+", label: "Meals Delivered" },
  { value: "340+",    label: "Families Helped" },
  { value: "80+",     label: "NGO Partners" },
  { value: "₹4.2L+",  label: "Funds Raised" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create an Account",      desc: "Sign up as a donor, NGO, or volunteer in under a minute.",                                          color: "#ff6600" },
  { step: "02", title: "Make a Donation",         desc: "Donate food, items, or money to verified campaigns and NGOs.",                                      color: "#c0453a" },
  { step: "03", title: "NGO Accepts & Delivers",  desc: "Verified NGOs accept donations and ensure they reach those in need.",                               color: "#e07b39" },
  { step: "04", title: "Track Your Impact",       desc: "Monitor your donations and see real-world impact through our dashboard.",                           color: "#b03a2e" },
];

const MISSION_POINTS = [
  { icon: "🍱", title: "Zero Hunger",       desc: "Every day, millions of children go to bed hungry. We connect surplus food with those who need it most — eliminating waste while fighting hunger." },
  { icon: "🤝", title: "Community Unity",   desc: "We believe kindness is contagious. Our platform empowers ordinary people to become everyday heroes in their communities." },
  { icon: "🌱", title: "Sustainable Impact",desc: "Through transparent reporting and verified NGO partnerships, we ensure every donation creates lasting, measurable change." },
];

const GALLERY = [
  { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80", alt: "Children receiving food" },
  { url: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80", alt: "Volunteers serving meals" },
  { url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80", alt: "Community donation" },
  { url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80", alt: "Child smiling after receiving food" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#faf6f1] font-[DM_Sans] overflow-x-hidden">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#faf6f1]/95 backdrop-blur-sm border-b border-black/5 px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-['DM_Serif_Display'] text-[20px]">
          <div className="w-3 h-3 bg-[#c0453a] rounded-full" />
          Heart Share
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-[#555] hover:text-[#c0453a] transition px-3 py-1.5">
            Login
          </Link>
          <Link to="/signup" className="text-sm bg-[#ff6600] hover:bg-[#e65c00] transition text-white px-4 py-2 rounded-lg font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div className="flex-1 max-w-xl" {...fadeUp}>
          <div className="inline-flex items-center gap-2 bg-[#fff0e8] text-[#c0453a] text-xs font-medium px-3 py-1.5 rounded-full mb-5 border border-[#f5c9b0]">
            🍱 Fighting hunger, one meal at a time
          </div>
          <h1 className="font-['DM_Serif_Display'] text-[42px] md:text-[54px] leading-tight text-[#1a1a1a] mb-5">
            Share from your <span className="text-[#c0453a]">heart,</span><br />feed a life.
          </h1>
          <p className="text-[#666] text-base leading-relaxed mb-8">
            HeartShare connects generous donors with verified NGOs to ensure surplus food,
            essential items, and funds reach children and families who need them most.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup" className="bg-[#ff6600] hover:bg-[#e65c00] transition text-white px-6 py-3 rounded-xl font-medium shadow-md shadow-orange-200">
              Start Donating →
            </Link>
            <a href="#how-it-works" className="border border-black/10 hover:bg-[#f0ebe4] transition text-[#444] px-6 py-3 rounded-xl font-medium">
              How It Works
            </a>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 grid grid-cols-2 gap-3 max-w-sm md:max-w-md w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {GALLERY.map((img, i) => (
            <div key={i} className={`rounded-2xl overflow-hidden shadow-md ${i === 0 ? "col-span-2 h-48" : "h-36"}`}>
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Stats Banner */}
      <motion.section
        className="bg-[#c0453a] py-10 px-6"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-['DM_Serif_Display'] text-[32px] md:text-[38px]">{s.value}</div>
              <div className="text-white/75 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Mission */}
      <section className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div className="text-center mb-14" {...fadeUp}>
          <div className="text-[#c0453a] text-sm font-medium uppercase tracking-widest mb-3">Our Purpose</div>
          <h2 className="font-['DM_Serif_Display'] text-[36px] md:text-[42px] text-[#1a1a1a]">Why HeartShare exists</h2>
          <p className="text-[#777] text-base mt-4 max-w-xl mx-auto leading-relaxed">
            Over 190 million children in India face food insecurity every day.
            We built HeartShare to make it effortless for anyone to help.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MISSION_POINTS.map((m, i) => (
            <motion.div
              key={m.title}
              className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-4xl mb-4">{m.icon}</div>
              <div className="font-semibold text-[#1a1a1a] mb-2">{m.title}</div>
              <div className="text-sm text-[#777] leading-relaxed">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emotional Quote Image */}
      <section className="py-10 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          className="relative rounded-3xl overflow-hidden min-h-[300px] md:min-h-[380px] flex items-end"
          initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80"
            alt="Children in need"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="relative z-10 p-8 md:p-12 text-white max-w-2xl">
            <p className="font-['DM_Serif_Display'] text-[26px] md:text-[34px] leading-snug mb-3">
              "A child who is fed can dream. A child who dreams can change the world."
            </p>
            <p className="text-white/70 text-sm">— HeartShare Mission Statement</p>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div className="text-center mb-14" {...fadeUp}>
          <div className="text-[#c0453a] text-sm font-medium uppercase tracking-widest mb-3">Simple Process</div>
          <h2 className="font-['DM_Serif_Display'] text-[36px] md:text-[42px] text-[#1a1a1a]">How it works</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((h, i) => (
            <motion.div
              key={h.step}
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-[28px] font-['DM_Serif_Display'] mb-3" style={{ color: h.color }}>{h.step}</div>
              <div className="font-semibold text-[#1a1a1a] mb-2 text-sm">{h.title}</div>
              <div className="text-xs text-[#888] leading-relaxed">{h.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 px-6 md:px-12 bg-[#fff8f2] border-y border-[#f0e6d3]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <motion.div className="flex-1" {...fadeUp}>
            <div className="text-[#c0453a] text-sm font-medium uppercase tracking-widest mb-3">Our Vision</div>
            <h2 className="font-['DM_Serif_Display'] text-[32px] md:text-[38px] text-[#1a1a1a] leading-snug mb-4">
              A world where no child sleeps hungry
            </h2>
            <p className="text-[#666] text-sm leading-relaxed">
              We envision an India where food surplus is never wasted, where communities
              stand for each other, and where technology bridges the gap between abundance
              and need. HeartShare is that bridge — built with love, powered by people.
            </p>
          </motion.div>
          <motion.div
            className="flex-1 rounded-2xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=700&q=80"
              alt="Volunteers working together"
              className="w-full h-64 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section className="py-20 px-6 text-center" {...fadeUp}>
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-5">❤️</div>
          <h2 className="font-['DM_Serif_Display'] text-[34px] md:text-[42px] text-[#1a1a1a] mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-[#777] text-base mb-8 leading-relaxed">
            Join thousands of donors, NGOs, and volunteers who are already changing lives one meal at a time.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="bg-[#ff6600] hover:bg-[#e65c00] transition text-white px-8 py-3 rounded-xl font-medium shadow-md shadow-orange-200 text-sm">
              Create Free Account →
            </Link>
            <Link to="/login" className="border border-black/10 hover:bg-[#f0ebe4] transition text-[#444] px-8 py-3 rounded-xl font-medium text-sm">
              Login
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white/60 text-center py-6 text-xs px-4">
        <div className="flex items-center justify-center gap-2 font-['DM_Serif_Display'] text-white text-base mb-2">
          <div className="w-2.5 h-2.5 bg-[#c0453a] rounded-full" />
          Heart Share
        </div>
        © {new Date().getFullYear()} HeartShare. Built with ❤️ to fight hunger.
      </footer>

    </div>
  );
}