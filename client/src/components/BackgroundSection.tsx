// components/BackgroundSection.tsx
interface BackgroundSectionProps {
  children: React.ReactNode;
}

export default function BackgroundSection({
  children,
}: BackgroundSectionProps) {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col">
      <section className="w-full h-[720px] bg-gradient-to-b from-[#FCFCFF] to-[#EFF4FD] flex items-center justify-center">
        <div className="max-w-7xl w-full h-full px-20 flex items-center justify-center gap-8">
          {children}
        </div>
      </section>
      <section className="bg-transparent w-full">
        <div className="max-w-7xl mx-auto px-6 pt-0 pb-20 flex justify-end"></div>
      </section>
    </main>
  );
}
