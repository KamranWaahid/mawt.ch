import type { Metadata } from "next";
import { Locale } from "@/i18n-config";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Documentation | MAWT Technical Execution" : "Documentation | Exécution Technique MAWT",
    description: lang === "en" 
      ? "Technical guides, API references, and conceptual overviews for the MAWT platform."
      : "Guides techniques, références API et aperçus conceptuels pour la plateforme MAWT.",
  };
}

export default function DocsPage() {
  return (
    <article className="flex flex-col gap-8">
      <h2 className="text-3xl font-normal tracking-tight text-black">Introduction</h2>
      <p className="text-lg text-neutral-500 font-normal leading-relaxed">
        MAWT is a technical execution platform designed to help modern businesses scale their operations through connected systems, automation, and on-demand engineering talent.
      </p>
      <p className="text-[16px] text-neutral-500 font-normal leading-relaxed">
        This documentation provides a comprehensive guide to understanding our methodology, integrating our systems into your existing workflows, and leveraging our embedded teams to accelerate your product development.
      </p>
      
      <div className="grid sm:grid-cols-2 gap-8 mt-8">
        <div className="p-8 border border-black/5 bg-neutral-50">
          <h3 className="text-lg font-normal text-black mb-4">Architecture</h3>
          <p className="text-sm text-neutral-500 font-normal leading-relaxed">
            Learn about our modular architecture and how it supports rapid scale and high-availability operations.
          </p>
        </div>
        <div className="p-8 border border-black/5 bg-neutral-50">
          <h3 className="text-lg font-normal text-black mb-4">API Reference</h3>
          <p className="text-sm text-neutral-500 font-normal leading-relaxed">
            Explore our comprehensive API documentation to build custom integrations and extend our platform's capabilities.
          </p>
        </div>
      </div>
    </article>
  );
}
