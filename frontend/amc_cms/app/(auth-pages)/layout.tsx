import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="flex flex-col gap-20 max-w-5xl px-5 py-28">
          <div className="max-w-7xl flex flex-col gap-12 items-start">
            {children}
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8">
          <p>Powered by SUICCHI</p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
