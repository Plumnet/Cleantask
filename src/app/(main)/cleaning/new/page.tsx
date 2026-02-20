import { PageContainer } from "@/components/layout/PageContainer";
import { CleaningForm } from "@/components/cleaning/CleaningForm";

export default function CleaningNewPage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">掃除タスク登録</h1>
      <CleaningForm />
    </PageContainer>
  );
}
