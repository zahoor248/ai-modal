"use client";

import { TrendCard } from "@/components/ui/TrendCard";
import { TrendFilters } from "@/components/ui/TrendFilters";
import { useEffect, useState } from "react";


type Trend = {
  query: string;
  active: boolean;
  search_volume: number;
  increase_percentage: number;
  categories: { id: number; name: string }[];
  related_queries?: { query: string }[];
};

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    const loadTrends = async () => {
      const res = await fetch("/api/v1/trends");
      const data = await res.json();
      setTrends(data.trending_searches || []);
    };
    loadTrends();
  }, []);

  // Filtered data
  const filteredTrends = trends.filter((t) => {
    const matchSearch = t.query.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" ||
      t.categories.some((c) => c.name.toLowerCase().includes(category));
    return matchSearch && matchCategory;
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">🔥 Trending Now</h1>

      <TrendFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrends.map((t) => (
          <TrendCard
            key={t.query}
            query={t.query}
            categories={t.categories.map((c) => c.name)}
            search_volume={t.search_volume}
            increase_percentage={t.increase_percentage}
            related_queries={t.related_queries?.map((rq) => rq.query)}
            active={t.active}
            updatedAt={timeRange}
          />
        ))}
      </div>
    </div>
  );
}
