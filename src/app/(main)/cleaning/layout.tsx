import { CleaningProvider } from "@/contexts/CleaningContext";
import { mockCategories } from "@/data/mockCategories";
import { getCleaningItems } from "@/lib/cleaning-db";

export default async function CleaningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = await getCleaningItems();
  return (
    <CleaningProvider initialItems={items} initialCategories={mockCategories}>
      {children}
    </CleaningProvider>
  );
}
