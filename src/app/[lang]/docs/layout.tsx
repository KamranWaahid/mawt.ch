import { DocsSidebar, DocGroup } from "@/components/ui/docs-sidebar";
import { Locale } from "@/i18n-config";
import { getDocs } from "@/lib/sanity.queries";

export default async function DocsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const docs = await getDocs();

  // Group docs by their 'group' field
  const groupedDocs = docs.reduce((acc: DocGroup[], doc) => {
    const groupName = doc.group || "General";
    const existingGroup = acc.find(g => g.title === groupName);
    
    if (existingGroup) {
      existingGroup.links.push({ title: doc.title, slug: doc.slug });
    } else {
      acc.push({
        title: groupName,
        links: [{ title: doc.title, slug: doc.slug }]
      });
    }
    return acc;
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 md:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row gap-20">
          <DocsSidebar lang={lang} groups={groupedDocs} />
          <main className="flex-1 max-w-[800px]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
