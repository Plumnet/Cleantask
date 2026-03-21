import { CleaningProvider } from "@/contexts/CleaningContext";
import { mockCategories } from "@/data/mockCategories";
import { getCleaningItems } from "@/lib/cleaning-db";
import { getCurrentUserId } from "@/lib/auth";

export default async function CleaningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  const items = await getCleaningItems(userId);
  return (
    <CleaningProvider initialItems={items} initialCategories={mockCategories}>
      {children}
    </CleaningProvider>
  );
}
