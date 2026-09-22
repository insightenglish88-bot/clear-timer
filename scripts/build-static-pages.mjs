import fs from 'fs';
import path from 'path';

const baseStyles = `
  :root {
    --bg: #0F172A;
    --card-bg: #1E293B;
    --text: #F8FAFC;
    --text-muted: #94A3B8;
    --border: #334155;
    --accent: #38BDF8;
    --accent-glow: rgba(56, 189, 248, 0.15);
    --badge-bg: rgba(56, 189, 248, 0.1);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    background-color: var(--bg);
    color: var(--text);
    line-height: 1.7;
    padding: 2.5rem 1rem;
  }
  .container { max-width: 920px; margin: 0 auto; }
  header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }
  .brand {
    display: inline-flex;
    align-items: baseline;
    gap: 0.5rem;
    font-weight: 800;
    font-size: 1.75rem;
    color: var(--text);
    text-decoration: none;
    margin-bottom: 0.75rem;
  }
  .brand span { color: var(--accent); }
  h1 {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    margin-bottom: 0.75rem;
    line-height: 1.25;
  }
  .subtitle {
    color: var(--text-muted);
    font-size: 1.05rem;
    margin-bottom: 1.25rem;
  }
  .nav-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  .nav-bar a {
    padding: 0.45rem 0.9rem;
    border-radius: 0.5rem;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    border: 1px solid var(--border);
    transition: all 0.2s ease;
  }
  .nav-bar a:hover, .nav-bar a.active {
    color: var(--text);
    background: var(--card-bg);
    border-color: var(--accent);
  }
  section {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 2rem;
  }
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--accent);
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
  }
  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #E2E8F0;
    margin: 1.25rem 0 0.5rem;
  }
  p { margin-bottom: 1.1rem; color: #CBD5E1; }
  ul, ol { margin-bottom: 1.25rem; padding-left: 1.5rem; color: #CBD5E1; }
  li { margin-bottom: 0.5rem; }
  .grid-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.25rem;
    margin: 1.5rem 0;
  }
  .card-item {
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 1.25rem;
  }
  .card-item h4 {
    font-size: 1.05rem;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }
  .tag {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.2rem 0.5rem;
    background: var(--badge-bg);
    color: var(--accent);
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
  }
  .callout {
    border-left: 4px solid var(--accent);
    padding: 1rem 1.25rem;
    background: rgba(56, 189, 248, 0.05);
    border-radius: 0 0.5rem 0.5rem 0;
    margin: 1.25rem 0;
  }
  footer {
    text-align: center;
    padding: 2.5rem 0 1rem;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.875rem;
  }
  footer a {
    color: var(--accent);
    text-decoration: none;
    margin: 0 0.5rem;
  }
  footer a:hover { text-decoration: underline; }
`;

function renderLayout(activePage, title, subtitle, content, canonical) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Clear Timer</title>
  <meta name="description" content="${subtitle}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" href="/logo-icon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <header>
      <a href="/" class="brand">Clear<span>Timer</span></a>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
      <nav class="nav-bar" aria-label="Site Navigation">
        <a href="/">Timer App</a>
        <a href="/about.html" ${activePage === 'about' ? 'class="active"' : ''}>About Us</a>
        <a href="/guide.html" ${activePage === 'guide' ? 'class="active"' : ''}>Classroom &amp; Pacing Guide</a>
        <a href="/terms.html" ${activePage === 'terms' ? 'class="active"' : ''}>Terms of Service</a>
        <a href="/privacy.html" ${activePage === 'privacy' ? 'class="active"' : ''}>Privacy Policy</a>
        <a href="/contact.html" ${activePage === 'contact' ? 'class="active"' : ''}>Contact</a>
      </nav>
    </header>

    <main>
      ${content}
    </main>

    <footer>
      <p>&copy; 2026 Clear Timer. Educational Precision Timing with Zero Compromise.</p>
      <p style="margin-top: 0.5rem;">
        <a href="/">Timer App</a> &bull;
        <a href="/about.html">About</a> &bull;
        <a href="/guide.html">Classroom Guide</a> &bull;
        <a href="/terms.html">Terms</a> &bull;
        <a href="/privacy.html">Privacy</a> &bull;
        <a href="/contact.html">Contact</a>
      </p>
    </footer>
  </div>
</body>
</html>`;
}

// 1. ABOUT PAGE CONTENT
const aboutContent = `
  <section>
    <h2>Our Mission &amp; Educational Vision</h2>
    <p>
      Clear Timer was created by language educators and software engineers to eliminate digital distraction and enhance temporal awareness across academic and professional environments. Traditional web timers are frequently bloated with noisy advertisements, flashing banners, or rigid countdown mechanics unsuited for real classrooms.
    </p>
    <p>
      Clear Timer addresses this gap by combining pedagogical cognitive research with modern hardware-accelerated web architecture. By giving teachers, students, and speech presenters an adaptive tool designed for their specific pacing needs, Clear Timer fosters structured focus and joyful learning.
    </p>
  </section>

  <section>
    <h2>Three Dedicated Profiles</h2>
    <div class="grid-cards">
      <div class="card-item">
        <span class="tag">Profile A</span>
        <h4>Young Learners English (YLE)</h4>
        <p>
          Engineered for Cambridge YLE (Starters, Movers, Flyers) and elementary ESL classrooms. Features high-contrast tactile numerals, visual countdown progression rings, celebratory sound fanfares, and an interactive team time scoreboard that turns speed drills into collaborative games.
        </p>
      </div>

      <div class="card-item">
        <span class="tag">Profile B</span>
        <h4>Middle School Study Blocks</h4>
        <p>
          Formulated to reinforce adolescent executive function and autonomous study habits. Integrates standard Pomodoro intervals (25-minute focus periods followed by 5-minute cognitive recovery breaks) alongside interactive task checklists to keep students grounded.
        </p>
      </div>

      <div class="card-item">
        <span class="tag">Profile C</span>
        <h4>Executive Business English</h4>
        <p>
          Geared toward Toastmasters speech rehearsals, elevator pitches, and corporate presentation drills. Delivers dynamic three-tier pacing feedback: Green (On Track for initial 80%), Amber (20% Wrap-up window), and Red (Overtime alert).
        </p>
      </div>
    </div>
  </section>

  <section>
    <h2>Core Engineering Principles</h2>
    <h3>Precision RequestAnimationFrame Timing</h3>
    <p>
      Conventional web timers rely on JavaScript <code>setInterval</code>, which accumulates significant drift when browser tabs are throttled or backgrounded. Clear Timer is powered by a high-resolution <code>requestAnimationFrame</code> loop calculating millisecond elapsed deltas against hardware timestamps, ensuring zero cumulative drift.
    </p>

    <h3>Privacy Shield (Blind Timing Drills)</h3>
    <p>
      Visual clocks can induce anxiety during speaking tests or memory recall activities. The Privacy Shield allows teachers to obscure the clock digits with a solid opaque cover (press 'C' or tap Cover) while the timer continues running accurately in the background, enabling stress-free blind timing.
    </p>

    <h3>Natural Human Voice Synthesis with Crescendo</h3>
    <p>
      Instead of shrill alarm buzzers that trigger classroom sensory overload, Clear Timer utilizes the browser Web Speech API to provide natural vocal countdowns (5, 4, 3, 2, 1, GO!) paired with an energetic harmonic crescendo swell.
    </p>
  </section>

  <section>
    <h2>Privacy &amp; Child Safety Standards</h2>
    <p>
      We are staunch advocates of digital safety in educational technology:
    </p>
    <ul>
      <li><strong>No Student Accounts:</strong> Students never register, log in, or provide personal information to participate in classroom activities.</li>
      <li><strong>Local-First Architecture:</strong> Rosters, session logs, and skin configurations reside securely in the educator's browser storage.</li>
      <li><strong>COPPA &amp; FERPA Adherence:</strong> We strictly adhere to child privacy protection statutes, avoiding behavioural profiling on minor-focused content.</li>
    </ul>
  </section>
`;

// 2. GUIDE PAGE CONTENT
const guideContent = `
  <section>
    <h2>Classroom &amp; Executive Timing Master Guide</h2>
    <p>
      Effective time management in educational and professional speaking contexts is more than simply watching seconds tick away; it is a psychological tool that structures cognitive attention, reduces anxiety, and builds temporal stamina. This guide outlines proven pedagogical methods and practical classroom strategies developed with Clear Timer.
    </p>
  </section>

  <section>
    <h2>Part 1: Young Learners English (YLE) Pedagogical Strategies</h2>
    <h3>1.1 Structuring Classroom Transitions</h3>
    <p>
      Young language learners often struggle with abrupt shifts between quiet desk work and active pair discussions. Setting a visible 3-minute transition timer gives children a concrete boundary, allowing them to wrap up conversations and tidy their workstations calmly.
    </p>

    <h3>1.2 The Blind Timing Challenge (Using Privacy Shield)</h3>
    <p>
      During Cambridge YLE speaking practice (such as picture storytelling or 'find the differences'), watching a countdown clock can create performance paralysis. By activating the Privacy Shield (press 'C'):
    </p>
    <ol>
      <li>The teacher announces the prompt and begins the timer with vocal countdown.</li>
      <li>The display is shielded, allowing the student to speak naturally without fixating on the remaining seconds.</li>
      <li>When the student concludes, the teacher taps Cover to reveal their exact duration, praising their self-pacing and fluency.</li>
    </ol>

    <h3>1.3 Team Relay Scoreboards</h3>
    <p>
      Transform grammatical drills and vocabulary sorting into collaborative team relays. Using the built-in Class Scoreboard, assign finish times to Team Tigers, Eagles, and Pandas. Recording times fosters camaraderie and motivates active engagement.
    </p>
  </section>

  <section>
    <h2>Part 2: Middle School Focus Blocks &amp; Executive Function</h2>
    <h3>2.1 The 25 / 5 Spaced Interval Cycle</h3>
    <p>
      Adolescent cognitive stamina benefits immensely from structured intervals. The Middle School mode implements the classic Pomodoro framework:
    </p>
    <ul>
      <li><strong>25 Minutes of Deep Work:</strong> Single-task immersion with zero phone notifications, dedicated to math problem sets, essay outlining, or reading comprehension.</li>
      <li><strong>5 Minutes of Cognitive Rest:</strong> Complete step away from screens—stretching, water hydration, or physical movement.</li>
      <li><strong>Long Break after 4 Cycles:</strong> A 15-to-30 minute restorative pause to prevent mental exhaustion.</li>
    </ul>

    <h3>2.2 Checklists and Dopamine Loops</h3>
    <p>
      Break larger projects into discrete 25-minute milestones. Checking off a task card at the sound of the completion chime reinforces positive dopamine feedback loops, transforming daunting homework into manageable victories.
    </p>
  </section>

  <section>
    <h2>Part 3: Executive Presentation Pacing &amp; Speech Drills</h2>
    <h3>3.1 Three-Phase Pace Monitoring</h3>
    <p>
      In high-stakes corporate meetings and keynote addresses, exceeding allotted time harms credibility. Clear Timer’s Business English profile provides visual biofeedback:
    </p>
    <ul>
      <li><strong style="color:#4ADE80">Green Zone (0% – 80%):</strong> On Track. Maintain steady articulation and conversational cadence.</li>
      <li><strong style="color:#FBBF24">Amber Zone (80% – 100%):</strong> Wrap-Up Window. Move toward summarizing core takeaways and deliver the call-to-action.</li>
      <li><strong style="color:#F87171">Red Zone (> 100%):</strong> Overtime Alert. Immediately conclude remarks to respect attendee schedules.</li>
    </ul>

    <h3>3.2 Elevator Pitch &amp; Lightning Talk Presets</h3>
    <p>
      Use the preset target duration chips to drill:
    </p>
    <ul>
      <li><strong>2 Minutes:</strong> Elevator pitch, standup updates, and executive briefing summaries.</li>
      <li><strong>5 Minutes:</strong> Ignite/PechaKucha-style project pitches and product demos.</li>
      <li><strong>15 Minutes:</strong> Strategic planning reviews, committee reports, and keynote addresses.</li>
    </ul>
  </section>

  <section>
    <h2>Part 4: Sensory Considerations &amp; Audio Ergonomics</h2>
    <p>
      Abrasive buzzers stimulate fight-or-flight stress responses that impair working memory. Clear Timer emphasizes acoustic comfort through natural synthesized human voices (with custom language accents) and gentle harmonic audio tones. The crescendo swell on "GO!" provides positive auditory signaling that primes learner attention.
    </p>
  </section>

  <section>
    <h2>Part 5: Best Practices for Projector &amp; Smartboard Display</h2>
    <div class="callout">
      <strong>Pro Tip for Classroom Displays:</strong> Use the <em>Retro Terminal</em> or <em>Cyberpunk Neon</em> themes in dimmed classrooms for maximum contrast, and <em>Executive Monochrome</em> or <em>Warm Studio Paper</em> in brightly sunlit lecture halls.
    </div>
  </section>
`;

// 3. PRIVACY PAGE CONTENT
const privacyContent = `
  <section>
    <h2>Clear Timer Privacy Policy &amp; Data Protection Disclosures</h2>
    <p><em>Effective Date: September 22, 2026</em></p>
    <p>
      Clear Timer ("we", "us", or "our") operates the web application located at 
      <a href="https://cleartimer-55025.web.app" style="color:var(--accent)">https://cleartimer-55025.web.app</a>. 
      We are dedicated to safeguarding the privacy of educators, students, and professionals who utilize our timing tools.
    </p>
  </section>

  <section>
    <h2>1. Information We Do Not Collect</h2>
    <p>
      In accordance with our privacy-by-design architecture:
    </p>
    <ul>
      <li>We do <strong>not</strong> require or collect student names, birthdates, email addresses, or school identification numbers.</li>
      <li>Classroom team names and session elapsed times entered into the scoreboard are stored within the educator’s local browser storage (LocalStorage) and are never cross-referenced or sold to third-party data brokers.</li>
    </ul>
  </section>

  <section>
    <h2>2. Cookies, Local Storage &amp; Web Beacons</h2>
    <p>
      Clear Timer utilizes standard web storage mechanisms for essential functional operations:
    </p>
    <ul>
      <li><strong>Local Storage:</strong> Remembers your chosen aesthetic skin (e.g. Cyberpunk, Monochrome), sound preferences, active voice accent, and locally saved classroom rosters.</li>
      <li><strong>Authentication Tokens:</strong> For educators who voluntarily choose to log in with Google to sync rosters across devices, secure Firebase Authentication tokens are stored in the browser.</li>
    </ul>
  </section>

  <section>
    <h2>3. Google AdSense &amp; Third-Party Advertising Disclosures</h2>
    <p>
      To sustain free access to Clear Timer without subscription barriers, we partner with Google AdSense (Publisher ID: <code>ca-pub-6159012230081663</code>) to display non-intrusive advertisements.
    </p>
    <ul>
      <li>Google and its advertising partners use cookies (including the DoubleClick / DART cookie) to serve ads based on prior visits to this and other websites on the internet.</li>
      <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">Google Ads Settings</a>.</li>
      <li>Alternatively, you can opt out of third-party vendor cookies for personalized ads by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">AboutAds.info Choices</a> or <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" style="color:var(--accent)">Your Online Choices (EU/UK)</a>.</li>
    </ul>
  </section>

  <section>
    <h2>4. Children's Online Privacy Protection Act (COPPA) Compliance</h2>
    <p>
      Protecting young learners is central to our mission:
    </p>
    <ul>
      <li>Clear Timer does not knowingly collect personal information from children under the age of 13.</li>
      <li>All student-facing features (stopwatch, countdown, scoreboard) operate anonymously without student account creation.</li>
      <li>We configure ad serving parameters to prevent behavioral profiling and personalized remarketing to minor demographics.</li>
    </ul>
  </section>

  <section>
    <h2>5. GDPR &amp; CCPA/CPRA Data Subject Rights</h2>
    <p>
      Depending on your jurisdiction, you possess the following rights regarding your data:
    </p>
    <ul>
      <li><strong>Right to Access:</strong> You may request an export of any cloud-synced roster data associated with your Google account.</li>
      <li><strong>Right to Erasure (Right to be Forgotten):</strong> You may request immediate deletion of your cloud-stored class rosters and account credentials.</li>
      <li><strong>Right to Non-Discrimination:</strong> We will never deny or degrade services for exercising your privacy rights.</li>
    </ul>
    <p>
      To exercise your privacy rights, email our Data Protection Desk at <a href="mailto:insightenglish88@gmail.com" style="color:var(--accent)">insightenglish88@gmail.com</a>.
    </p>
  </section>
`;

// 4. CONTACT PAGE CONTENT
const contactContent = `
  <section>
    <h2>Contact &amp; Educator Support Desk</h2>
    <p>
      Whether you are an ESL teacher seeking tailored classroom presets, a school administrator inquiring about institutional deployment, or a developer reporting an accessibility suggestion, we welcome your feedback.
    </p>
  </section>

  <section>
    <h2>Direct Contact Information</h2>
    <div class="grid-cards">
      <div class="card-item">
        <span class="tag">Primary Support</span>
        <h4>Educator &amp; Technical Desk</h4>
        <p>Email: <a href="mailto:insightenglish88@gmail.com" style="color:var(--accent); font-weight:600;">insightenglish88@gmail.com</a></p>
        <p style="font-size:0.875rem; color:var(--text-muted); margin-top:0.5rem;">Typical response window: 24 to 48 business hours.</p>
      </div>

      <div class="card-item">
        <span class="tag">Open Source &amp; Hosting</span>
        <h4>Project Infrastructure</h4>
        <p>Platform: Firebase Hosting &amp; Google Cloud Platform</p>
        <p>Domain: <a href="https://cleartimer-55025.web.app" style="color:var(--accent);">https://cleartimer-55025.web.app</a></p>
      </div>
    </div>
  </section>

  <section>
    <h2>Inquiry Categories</h2>
    <h3>1. Classroom Feature Requests</h3>
    <p>
      Have an idea for a new countdown fanfare, specialized ESL interval preset, or scoreboard export format? Let us know your classroom requirements and we will review it for upcoming releases.
    </p>

    <h3>2. Privacy &amp; Data Deletion Requests</h3>
    <p>
      To request permanent deletion of cloud-synced classroom rosters or to inquire about our COPPA/FERPA compliance protocols, email our privacy desk with the subject line <code>[Privacy Request]</code>.
    </p>

    <h3>3. Bug &amp; Security Reports</h3>
    <p>
      Clear Timer maintains high security hygiene with automated SecOps routines. If you discover a potential vulnerability or rendering defect, please provide the browser version, operating system, and reproduction steps.
    </p>
  </section>
`;

const pages = [
  { file: 'about.html', active: 'about', title: 'About Clear Timer — Mission & Methodology', subtitle: 'Adaptive multi-tier classroom, study, and executive presentation timer platform.', content: aboutContent, canonical: 'https://cleartimer-55025.web.app/about.html' },
  { file: 'guide.html', active: 'guide', title: 'Classroom & Executive Timing Master Guide', subtitle: 'Pedagogical strategies, YLE game pacing, Pomodoro study blocks, and presentation benchmarks.', content: guideContent, canonical: 'https://cleartimer-55025.web.app/guide.html' },
  { file: 'privacy.html', active: 'privacy', title: 'Privacy Policy & Data Compliance', subtitle: 'Comprehensive disclosures for GDPR, CCPA, COPPA, FERPA, and Google AdSense.', content: privacyContent, canonical: 'https://cleartimer-55025.web.app/privacy.html' },
  { file: 'contact.html', active: 'contact', title: 'Contact & Educator Support Desk', subtitle: 'Get in touch for teacher feedback, institutional inquiries, and support requests.', content: contactContent, canonical: 'https://cleartimer-55025.web.app/contact.html' },
];

const publicDir = path.resolve('public');
for (const p of pages) {
  const target = path.join(publicDir, p.file);
  const html = renderLayout(p.active, p.title, p.subtitle, p.content, p.canonical);
  fs.writeFileSync(target, html, 'utf8');
  console.log(`Generated: ${target}`);
}

console.log('All static pages successfully generated.');
