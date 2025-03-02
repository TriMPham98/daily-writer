import Header from "@/components/Header";
import WritingStats from "@/components/WritingStats";

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WritingStats />
        </div>
      </main>
    </div>
  );
}
