import Header from "@/components/Header";
import WritingEditor from "@/components/WritingEditor";
import EntriesList from "@/components/EntriesList";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <WritingEditor targetWordCount={50} />
          <EntriesList />
        </div>
      </main>
    </div>
  );
}
