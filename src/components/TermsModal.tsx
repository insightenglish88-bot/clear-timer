import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useDialog } from '../hooks/useDialog';
import {
  X,
  ShieldCheck,
  FileText,
  Lock,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { SkinTokens } from '../theme/skins';

interface TermsModalProps {
  tokens: SkinTokens;
  initialTab?: 'terms' | 'privacy' | 'coppa' | 'erasure';
  onClose: () => void;
}

type LegalTab = 'terms' | 'privacy' | 'coppa' | 'erasure';

export function TermsModal({
  tokens,
  initialTab = 'terms',
  onClose,
}: TermsModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const dialogRef = useDialog<HTMLDivElement>(onClose);
  const prefersReducedMotion = useReducedMotion();

  const isBracket = !!tokens.buttons.bracketStyle;
  const pillRounded = tokens.buttons.pillRounded;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/75 backdrop-blur-sm select-none"
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        initial={prefersReducedMotion ? false : { scale: 0.96 }}
        animate={prefersReducedMotion ? {} : { scale: 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col ${pillRounded} border-2 sm:border-4 ${tokens.surface.border} ${tokens.surface.bg} ${tokens.canvas.text} ${tokens.surface.shadow} overflow-hidden select-text`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-3.5 sm:p-5 border-b ${tokens.surface.border} bg-black/10 dark:bg-white/5 select-none`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 ${pillRounded} flex items-center justify-center shadow-xs ${tokens.accent.badgeBg} ${tokens.accent.badgeText} border ${tokens.accent.badgeBorder}`}
            >
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2
                id="terms-title"
                className={`${tokens.typography.fontDisplay} font-bold text-base sm:text-xl leading-tight`}
              >
                {isBracket
                  ? '[ TERMS & REGULATORY COMPLIANCE ]'
                  : 'Terms of Service & Data Compliance'}
              </h2>
              <p className="text-xs opacity-75">
                GDPR • CCPA/CPRA • COPPA • FERPA • Google API Services Policy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/terms.html"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold ${pillRounded} ${tokens.buttons.secondary} transition-all`}
              title="Open full terms page in new tab"
            >
              <span>Full Page</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close terms dialog"
              className={`p-2 ${pillRounded} transition-all cursor-pointer ${tokens.buttons.secondary}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Regulatory Badges Bar */}
        <div
          className={`px-3.5 sm:px-5 py-2 border-b ${tokens.surface.border} bg-black/5 dark:bg-white/5 flex items-center gap-1.5 overflow-x-auto select-none`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mr-1">
            Compliant with:
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3" /> GDPR (EU/UK)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <CheckCircle2 className="w-3 h-3" /> CCPA / CPRA
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> COPPA (Children)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <CheckCircle2 className="w-3 h-3" /> FERPA Aligned
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            <CheckCircle2 className="w-3 h-3" /> Google OAuth Limited Use
          </span>
        </div>

        {/* Navigation Tabs */}
        <div
          className={`px-3.5 sm:px-5 py-2 border-b ${tokens.surface.border} flex items-center gap-1.5 overflow-x-auto select-none`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'terms'
                ? `${tokens.buttons.primaryStart} shadow-sm ring-1 ring-white/30`
                : `${tokens.buttons.secondary} opacity-80 hover:opacity-100`
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'privacy'
                ? `${tokens.buttons.primaryStart} shadow-sm ring-1 ring-white/30`
                : `${tokens.buttons.secondary} opacity-80 hover:opacity-100`
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>GDPR &amp; CCPA Privacy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('coppa')}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coppa'
                ? `${tokens.buttons.primaryStart} shadow-sm ring-1 ring-white/30`
                : `${tokens.buttons.secondary} opacity-80 hover:opacity-100`
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>COPPA &amp; Student Privacy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('erasure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'erasure'
                ? `${tokens.buttons.primaryStart} shadow-sm ring-1 ring-white/30`
                : `${tokens.buttons.secondary} opacity-80 hover:opacity-100`
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Rights &amp; Erasure</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-inherit border-b pb-1 border-white/10">
                1. Terms of Service Agreement
              </h3>
              <p>
                By accessing or using Clear Timer (<a href="https://cleartimer-55025.web.app" target="_blank" rel="noopener noreferrer" className="underline font-bold">cleartimer-55025.web.app</a>), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must discontinue using the application.
              </p>

              <h4 className="font-bold text-amber-400">1.1 Permitted Educational &amp; Professional Use</h4>
              <p>
                Clear Timer is provided as an adaptive visual stopwatch, study block countdown, and classroom activity timer. You are granted a personal, non-exclusive, non-transferable revocable license to utilize the application for classroom learning drills, study focus blocks, and executive pacing rehearsals.
              </p>

              <h4 className="font-bold text-amber-400">1.2 Critical Timing Disclaimer</h4>
              <p>
                Clear Timer is strictly intended for educational and productivity purposes. <strong>Do NOT use this application for mission-critical, aviation, medical, surgical, legal emergency, or industrial safety timing</strong> where any software interruption or device failure could risk health, safety, or life.
              </p>

              <h4 className="font-bold text-amber-400">1.3 Limitation of Liability</h4>
              <p>
                The software is delivered "AS IS" without warranty of any kind. Under no circumstances will Clear Timer, its authors, or contributors be held liable for any damages or losses arising from application usage, clock drifts, or internet disruptions.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-inherit border-b pb-1 border-white/10">
                2. Privacy Policy, GDPR &amp; CCPA/CPRA Compliance
              </h3>
              <p>
                Clear Timer adheres strictly to the European Union General Data Protection Regulation (GDPR - Regulation 2016/679) and California Consumer Privacy Act (CCPA/CPRA).
              </p>

              <h4 className="font-bold text-blue-400">2.1 Data Minimization Principle</h4>
              <p>
                We collect only the absolute minimum data required to deliver core application functionality:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Local Users (Signed Out):</strong> No personal data is collected or sent to remote servers. Classrooms and timing logs remain 100% inside your browser's private <code>localStorage</code>.</li>
                <li><strong>Google Sign-In Users:</strong> When signing in with Google, we store your Firebase User ID (UID), email address, and your user-created classroom rosters and recorded times in an encrypted private Firestore document (<code>user_classes/{'{userId}'}</code>).</li>
              </ul>

              <h4 className="font-bold text-blue-400">2.2 Absolute Non-Sale Guarantee</h4>
              <p className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <strong>We do not sell, rent, monetize, or trade your personal data</strong> or student classroom records to any third-party advertisers, data aggregators, or brokers under any conditions.
              </p>

              <h4 className="font-bold text-blue-400">2.3 Google API User Data Policy Compliance</h4>
              <p>
                Clear Timer's use of information received from Google APIs adheres strictly to the <strong>Google API Services User Data Policy</strong>, including the Limited Use requirements. Google OAuth profile data is never used for advertising, nor is it transferred to external machine learning (ML) models.
              </p>
            </div>
          )}

          {activeTab === 'coppa' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-inherit border-b pb-1 border-white/10">
                3. Children's Privacy (COPPA) &amp; Educational Records (FERPA)
              </h3>

              <h4 className="font-bold text-emerald-400">3.1 Children's Online Privacy Protection Act (COPPA)</h4>
              <p>
                Clear Timer is engineered for classroom safety when used with children under the age of 13:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>No Student Accounts:</strong> Students do not create user accounts, submit email addresses, or log into the application.</li>
                <li><strong>Educator Supervision:</strong> Google Authentication is reserved exclusively for teachers, adult educators, or team facilitators aged 18 and older.</li>
                <li><strong>Anonymous Team Labels:</strong> Educators are advised to use non-identifiable identifiers (e.g. <em>"Team Tigers"</em>, <em>"Group Blue"</em>, <em>"Table 1"</em>) rather than children's real full names or private information.</li>
              </ul>

              <h4 className="font-bold text-emerald-400">3.2 Family Educational Rights and Privacy Act (FERPA)</h4>
              <p>
                Clear Timer does not collect, index, or maintain educational records, test scores, or behavioral profiles as defined under 34 CFR Part 99. Classroom finish times logged during games do not constitute FERPA education records. Schools maintain exclusive control over any class designations.
              </p>
            </div>
          )}

          {activeTab === 'erasure' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-inherit border-b pb-1 border-white/10">
                4. User Data Rights, Export &amp; Erasure (GDPR Art. 17)
              </h3>
              <p>
                You possess full autonomy over your data under GDPR, CCPA, and global privacy standards:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className={`p-3 ${pillRounded} border border-white/10 bg-black/10 dark:bg-white/5`}>
                  <h5 className="font-bold text-amber-400 mb-1">Right to Access &amp; Portability</h5>
                  <p className="text-xs opacity-80">
                    You can view, review, and export all classroom configurations and recorded times directly from the Scoreboard interface at any moment.
                  </p>
                </div>

                <div className={`p-3 ${pillRounded} border border-white/10 bg-black/10 dark:bg-white/5`}>
                  <h5 className="font-bold text-rose-400 mb-1">Right to Complete Erasure</h5>
                  <p className="text-xs opacity-80">
                    Deleting a class in the app purges its team roster immediately. To permanently delete your entire Google-linked Cloud Firestore document, email our privacy desk.
                  </p>
                </div>
              </div>

              <h4 className="font-bold text-inherit pt-2">Data Protection Officer &amp; Inquiries:</h4>
              <p className="opacity-80">
                Email: <a href="mailto:insightenglish88@gmail.com" className="underline font-bold text-amber-400">insightenglish88@gmail.com</a><br />
                Address: Clear Timer Project Operations, Educational Technology Compliance Desk
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`p-3 sm:p-4 border-t ${tokens.surface.border} bg-black/10 dark:bg-white/5 flex flex-wrap items-center justify-between gap-2 select-none`}
        >
          <span className="text-xs opacity-75">
            Effective Date: September 2026 • Verified Regulatory Compliance
          </span>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-1.5 ${pillRounded} text-xs font-bold transition-all cursor-pointer ${tokens.buttons.primaryStart}`}
          >
            {isBracket ? '[ UNDERSTOOD & CLOSE ]' : 'Understood & Close'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
