import { Link } from 'react-router-dom';
import { GitFork, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function FinalCTA() {
  return (
    <section className="py-24 lg:py-24 bg-[#090D14] relative overflow-hidden border-b border-[#2B3544]">
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] h-[280px] sm:h-[500px] bg-[#54C7BE]/6 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none overflow-hidden" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] bg-[#C6B99A]/6 rounded-full blur-[80px] sm:blur-[110px] pointer-events-none overflow-hidden" />

      <div className="container-enterprise relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Heading: Solid Ivory White (#F2F0EA) */}
          <h2 className="text-3xl sm:text-4xl md:text-[38px] lg:text-[54px] font-extrabold font-heading text-[#F2F0EA] tracking-tight leading-[1.15]">
            Modernize Your Code. <br className="hidden sm:inline" />
            Preserve Your Confidence.
          </h2>

          {/* Supporting paragraph - View 14 & Image 7 in reference */}
          <p className="mt-5 text-base sm:text-lg text-[#9AA7B5] max-w-2xl mx-auto leading-relaxed font-body">
            Join developers who upgrade dependencies safely with open-weight AI.
          </p>

          {/* Action buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup">
              <Button
                variant="primary"
                size="md"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
                className="bg-[#C6B99A] text-[#090D14] hover:bg-[#DDD2BA] font-semibold h-12 px-6 rounded-[10px]"
              >
                Get Started Free
              </Button>
            </Link>

            <Link to="/open-source">
              <Button
                variant="secondary"
                size="md"
                icon={<GitFork size={16} />}
                className="h-12 px-6 rounded-[10px]"
              >
                Open Source Repository
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
