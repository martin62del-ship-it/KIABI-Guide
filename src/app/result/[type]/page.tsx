import { notFound } from "next/navigation";
import { ResultView } from "@/components/result/ResultView";
import { SLUG_TO_ID, ID_TO_SLUG } from "@/lib/engine/slug";

export function generateStaticParams() {
  return Object.values(ID_TO_SLUG).map((type) => ({ type }));
}

export default function ResultPage({ params }: { params: { type: string } }) {
  const id = SLUG_TO_ID[params.type];
  if (!id) notFound();
  return <ResultView type={id} />;
}
