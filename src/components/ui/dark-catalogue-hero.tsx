import { CurtainLink } from "@/components/ui/curtain-link";

type DarkCatalogueHeroProps = {
  wordmark: string;
  title: string;
  description?: string;
  crossHref?: string;
  crossLabel?: string;
};

/**
 * Shared hero for secondary dark-catalogue pages (legal, FAQ, partners, etc.).
 * Matches Services / Work scale without inventing page-specific art direction.
 */
export function DarkCatalogueHero({
  wordmark,
  title,
  description,
  crossHref,
  crossLabel,
}: DarkCatalogueHeroProps) {
  return (
    <section className="catalogue-hero-pad">
      <div className="site-container-xwide">
        <div className="grid gap-8 md:gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.4rem,8vw,5rem)] font-medium leading-[0.98] tracking-tight text-white break-words">
              <span className="block">
                {wordmark}
                {crossHref && crossLabel ? (
                  <>
                    {" "}
                    <CurtainLink
                      href={crossHref}
                      className="text-white/40 underline decoration-white/15 underline-offset-4 transition-colors hover:text-white/55 [@media(hover:hover)]:text-white/15 [@media(hover:hover)]:no-underline [@media(hover:hover)]:hover:text-white/40"
                    >
                      {crossLabel}
                    </CurtainLink>
                  </>
                ) : null}
              </span>
              <span className="mt-3 block max-w-[18ch] text-[clamp(1.45rem,4.5vw,2.8rem)] font-medium leading-[1.08] text-white/88 sm:mt-4">
                {title}
              </span>
            </h1>
          </div>
          {description ? (
            <div className="lg:col-span-4">
              <p className="max-w-[36ch] text-[16px] font-normal leading-relaxed text-white/55 md:text-[17px]">
                {description}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
