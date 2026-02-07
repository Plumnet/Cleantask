import type { Category } from "@/types/category";

export const mockCategories: Category[] = [
  { id: "cat-1", name: "リビング", color: "bg-blue-100 text-blue-800" },
  { id: "cat-2", name: "キッチン", color: "bg-green-100 text-green-800" },
  { id: "cat-3", name: "浴室", color: "bg-cyan-100 text-cyan-800" },
  { id: "cat-4", name: "トイレ", color: "bg-purple-100 text-purple-800" },
  { id: "cat-5", name: "寝室", color: "bg-pink-100 text-pink-800" },
  { id: "cat-6", name: "洗面所", color: "bg-yellow-100 text-yellow-800" },
  { id: "cat-7", name: "その他", color: "bg-gray-100 text-gray-800" },
];

export const mockConsumableCategories: Category[] = [
  { id: "ccat-1", name: "洗剤", color: "bg-blue-100 text-blue-800" },
  { id: "ccat-2", name: "衛生用品", color: "bg-green-100 text-green-800" },
  {
    id: "ccat-3",
    name: "キッチン消耗品",
    color: "bg-orange-100 text-orange-800",
  },
  { id: "ccat-4", name: "日用品", color: "bg-purple-100 text-purple-800" },
  { id: "ccat-5", name: "その他", color: "bg-gray-100 text-gray-800" },
];
