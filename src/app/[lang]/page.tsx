import { ClientsSection } from "@/components/sections/clients-section";
import { DescriptionSection } from "@/components/sections/description-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { InsightsSection } from "@/components/sections/insights-section";
import { WorkSection } from "@/components/sections/work-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { VisionSection } from "@/components/sections/vision-section";
import { SiteHeader } from "@/components/sections/site-header";
import { getHomePageData } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const data = await getHomePageData();

  return (
    <>
      <HeroSection settings={data.settings} dict={dictionary.hero} />
      <ClientsSection dict={dictionary.clients} />
      <DescriptionSection dict={dictionary.description} />
      <ProblemSection dict={dictionary.problem} />
      <VisionSection dict={dictionary.vision} />
      <SolutionSection dict={dictionary.solution} />
      <ProcessSection dict={dictionary.process} />
      <WorkSection dict={dictionary.work} projects={data.projects} />
      <InsightsSection dict={dictionary.insights} posts={data.posts} />
    </>
  );
}
