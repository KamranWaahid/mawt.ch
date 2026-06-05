import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { LoginForm } from "@/components/ui/login-form";
import { Metadata } from "next";

interface LoginPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.login.title} | MAWT`,
    description: dict.login.subtitle,
    robots: { index: false, follow: false }, // Don't index login page
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Motifs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] aspect-square border border-black rounded-full" />
        <div className="absolute top-[60%] -right-[10%] w-[50%] aspect-square border border-black rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[200%] bg-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-px bg-black" />
      </div>

      <div className="w-full relative z-10 flex flex-col items-center gap-12">
        {/* Simple Brand Header */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-normal tracking-tighter text-[#0A252E]">M&WT</span>
          <div className="h-2 w-2 bg-[#75DAB4]" />
        </div>

        <LoginForm dict={dict.login} lang={lang} />
      </div>

      {/* Security Footer */}
      <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-center text-[10px] text-black/20 font-normal uppercase tracking-[0.3em]">
         <span>Node: MAWT-CH-01</span>
         <span>Security Level: Enterprise</span>
      </div>
    </main>
  );
}
