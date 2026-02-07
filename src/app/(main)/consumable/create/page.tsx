import { PageContainer } from "@/components/layout/PageContainer";
import { ConsumableForm } from "@/components/consumable/ConsumableForm";

export default function ConsumableCreatePage() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">消耗品登録</h1>
      <ConsumableForm />
    </PageContainer>
  );
}
