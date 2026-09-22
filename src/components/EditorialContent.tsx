import { useState, type ReactNode } from 'react';
import { SkinTokens } from '../theme/skins';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Volume2,
  ChevronDown,
  ExternalLink,
  Presentation,
  Clock,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface EditorialContentProps {
  tokens: SkinTokens;
  children?: ReactNode; // Can pass AdBanner here
}

export function EditorialContent({ tokens, children }: EditorialContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const isBracket = !!tokens.buttons.bracketStyle;

  const faqs = [
    {
      q: 'What is Clear Timer and who is it designed for?',
      a: 'Clear Timer is an adaptive multi-tier precision timing application created for language educators, secondary students, and professional public speakers. Unlike generic online timers filled with distracting popups and noisy buzzers, Clear Timer provides three specialized operational modes (Young Learners English, Middle School Focus Blocks, and Business English Presentation Pacing) coupled with an opaque Privacy Shield and natural human voice synthesis.',
    },
    {
      q: 'How does the Privacy Shield Cover work in classroom speaking tests?',
      a: 'During Cambridge YLE speaking drills, storytelling challenges, or memory recall games, visual countdown numbers can cause performance anxiety. Tapping Cover (or pressing the "C" key) overlays a 100% opaque solid shield while the millisecond timing engine continues running silently. Teachers can reveal the exact elapsed duration upon student completion, fostering natural fluency over clock-watching.',
    },
    {
      q: 'How does presentation pacing work in Business English mode?',
      a: 'Business English mode features three-tier visual feedback based on your target duration: Green indicates On Track (0%–80% of allotted time), Amber signifies the Wrap-Up Window (80%–100%), and Red warns of an Overtime Alert (>100%). It includes one-click presets for 2-minute elevator pitches, 5-minute lightning talks, and 15-minute keynote addresses.',
    },
    {
      q: 'Does Clear Timer work offline in lecture halls without Wi-Fi?',
      a: 'Yes. Clear Timer is built as a progressive web application with local-first persistence. The timing engine, audio synthesis cues, skin preferences, and classroom rosters are stored locally in your browser LocalStorage, allowing full functionality even when teaching in rooms with weak internet.',
    },
    {
      q: 'How does Clear Timer protect student privacy under COPPA and FERPA?',
      a: 'Clear Timer adheres to strict privacy-by-design standards. Students never register, create accounts, or enter personal data. All team names and classroom times are managed by the teacher anonymously. We do not engage in behavioral profiling, remarketing, or sale of student data.',
    },
    {
      q: 'Why does Clear Timer use voice countdowns instead of traditional loud buzzers?',
      a: 'Abrasive sirens trigger a physiological fight-or-flight stress reaction that impairs cognitive working memory. Clear Timer integrates browser Web Speech API synthesis, allowing teachers to choose from multiple natural accents followed by a gentle harmonic crescendo swell on "GO!", establishing calm readiness and positive classroom atmosphere.',
    },
    {
      q: 'Can educators synchronize student rosters across multiple laptops?',
      a: 'Yes. While Clear Timer works completely anonymously by default, teachers who wish to synchronize multiple classes across interactive whiteboards, tablets, and personal laptops can sign in with Google to enable secure Google Cloud Firestore cloud synchronization.',
    },
  ];

  return (
    <article
      id="editorial-content"
      className="w-full max-w-5xl mx-auto mt-6 sm:mt-10 px-3 sm:px-6 pb-16 flex flex-col gap-8 text-left select-text"
      aria-label="Educational Timing Guide, Pedagogical Framework, and Frequently Asked Questions"
    >
      {/* SECTION 1: EDUCATIONAL FRAMEWORK & MISSION */}
      <section
        className={`p-6 sm:p-8 rounded-2xl border ${tokens.surface.border} ${tokens.surface.bg} backdrop-blur-md shadow-lg transition-all`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${tokens.accent.badgeBg} ${tokens.accent.badgeText}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
              {isBracket ? '[ PEDAGOGICAL METHODOLOGY ]' : 'Pedagogical Methodology'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Classroom Time Management &amp; Attention Architecture
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base leading-relaxed opacity-90 mb-4">
          Time perception plays a decisive role in classroom attention, cognitive load retention, and public speaking composure. Generic online timers are frequently unsuited for professional and educational environments: they flash intrusive commercial media, lack sensory-safe auditory transitions, or lock users into rigid single-purpose interfaces.
        </p>

        <p className="text-sm sm:text-base leading-relaxed opacity-90 mb-6">
          Clear Timer was engineered by language instructors and web engineers to provide a distraction-free, hardware-accelerated timing platform tailored to three distinct developmental and professional profiles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-sky-400">
              <Sparkles className="w-4 h-4" /> Young Learners (YLE)
            </div>
            <p className="text-xs leading-relaxed opacity-80">
              Tactile high-contrast numerals, gamified countdown rings, positive audio fanfares, and team time scoreboards for Cambridge Starters, Movers, and Flyers games.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-400">
              <Clock className="w-4 h-4" /> Middle School Focus
            </div>
            <p className="text-xs leading-relaxed opacity-80">
              Structured Pomodoro focus cycles (25m study blocks / 5m cognitive recovery) paired with task checklist management to instill autonomous study habits.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
              <Presentation className="w-4 h-4" /> Executive Pacing
            </div>
            <p className="text-xs leading-relaxed opacity-80">
              Real-time pace biofeedback with three-tier color zones (Green On Track, Amber Wrap-Up, Red Overtime) for keynote speakers, pitches, and meetings.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: ADVERTISEMENT SLOT (Contextually surrounded by rich editorial content) */}
      {children && (
        <div className="w-full my-2">
          {children}
        </div>
      )}

      {/* SECTION 3: KEY PEDAGOGICAL DRILLS */}
      <section
        className={`p-6 sm:p-8 rounded-2xl border ${tokens.surface.border} ${tokens.surface.bg} backdrop-blur-md shadow-lg transition-all`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${tokens.accent.badgeBg} ${tokens.accent.badgeText}`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
              {isBracket ? '[ CLASSROOM DRILLS ]' : 'Classroom Drills'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Evidence-Based Timing Techniques for Teachers &amp; Coaches
            </h2>
          </div>
        </div>

        <div className="space-y-5 text-sm sm:text-base leading-relaxed opacity-90">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-1 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white/10">Drill 1</span>
              The Blind Fluency Sprint (Privacy Shield)
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              When students prepare for Cambridge speaking assessments, watching seconds tick down causes cognitive freezing. Press <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-white/10 border border-white/20">C</kbd> to activate the Privacy Shield. The timer runs invisibly in the background. Once the learner completes their story, unmask the clock to celebrate their natural speaking pace.
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="font-bold text-base sm:text-lg mb-1 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white/10">Drill 2</span>
              Team Relay Pacing &amp; Scoreboard Recognition
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Divide students into tables (Tigers, Lions, Eagles). Launch the timer with spacebar. As each team finishes sorting their vocabulary cards or grammar puzzles, tap their team button in the scoreboard to log their elapsed time, turning rote learning into cooperative play.
            </p>
          </div>

          <div className="border-t border-white/10 pt-4">
            <h3 className="font-bold text-base sm:text-lg mb-1 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-white/10">Drill 3</span>
              The 2-Minute Executive Pitch Calibration
            </h3>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
              Set target duration to 2 minutes in Business English mode. Presenters practice articulating their value proposition. The visual clock shifts from green to amber at the 1:36 mark, providing immediate subconscious cueing to deliver the concluding call-to-action before the red overtime alert.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: INTERACTIVE FAQ */}
      <section
        className={`p-6 sm:p-8 rounded-2xl border ${tokens.surface.border} ${tokens.surface.bg} backdrop-blur-md shadow-lg transition-all`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2.5 rounded-xl ${tokens.accent.badgeBg} ${tokens.accent.badgeText}`}>
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
              {isBracket ? '[ FREQUENTLY ASKED QUESTIONS ]' : 'Frequently Asked Questions'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Frequently Asked Questions &amp; Best Practices
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-white/10 rounded-xl overflow-hidden bg-white/5 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm sm:text-base hover:bg-white/5 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-sky-400' : 'opacity-60'
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs sm:text-sm opacity-80 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: EXPLORE MORE GUIDES & REGULATORY DOCUMENTATION */}
      <section
        className={`p-6 sm:p-8 rounded-2xl border ${tokens.surface.border} ${tokens.surface.bg} backdrop-blur-md shadow-lg transition-all`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${tokens.accent.badgeBg} ${tokens.accent.badgeText}`}>
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
              {isBracket ? '[ COMPREHENSIVE DOCUMENTATION ]' : 'Comprehensive Documentation'}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              In-Depth Educational Guides &amp; Regulatory Disclosures
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm opacity-85 leading-relaxed mb-5">
          Access our complete collection of pedagogical reference materials, data protection disclosures, and developer contact desks:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <a
            href="/about.html"
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-sky-400 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm">About Clear Timer</div>
              <div className="opacity-60 text-[11px]">Mission, team &amp; architecture</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/guide.html"
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-sky-400 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm">Classroom Guide</div>
              <div className="opacity-60 text-[11px]">Pedagogical &amp; speech pacing</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/privacy.html"
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-sky-400 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm">Privacy Policy</div>
              <div className="opacity-60 text-[11px]">COPPA, GDPR &amp; AdSense</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/terms.html"
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-sky-400 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm">Terms &amp; Conditions</div>
              <div className="opacity-60 text-[11px]">Full regulatory terms of service</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="/contact.html"
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-sky-400 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm">Contact &amp; Support</div>
              <div className="opacity-60 text-[11px]">Teacher helpdesk &amp; feedback</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-lg border border-white/10 bg-white/5 hover:border-sky-400 hover:bg-white/10 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-sm">Google Ad Settings</div>
              <div className="opacity-60 text-[11px]">Opt-out of personalized ads</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </section>
    </article>
  );
}
