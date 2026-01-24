"use client";

import NewsEditor from "@/app/components/NewsEditor";
import { useParams } from "next/navigation";

export default function NewsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  return <NewsEditor id={id} />;
}
