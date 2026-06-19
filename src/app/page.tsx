import Story from "@/components/Story";
import { STORY } from "@/lib/content";

export default function Page() {
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-black">
      <Story cards={STORY} />
    </main>
  );
}
