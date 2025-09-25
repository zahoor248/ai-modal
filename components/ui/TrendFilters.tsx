"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type TrendFiltersProps = {
  search: string;
  onSearchChange: (v: string) => void;
  category: string;
  onCategoryChange: (v: string) => void;
  timeRange: string;
  onTimeRangeChange: (v: string) => void;
};

export function TrendFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  timeRange,
  onTimeRangeChange,
}: TrendFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between bg-white/60 dark:bg-gray-900/40 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20">
      <Input
        placeholder="🔍 Search trends..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full md:w-1/3"
      />

      <div className="flex gap-4 flex-wrap">
        {/* Category */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="tech">Tech</SelectItem>
            <SelectItem value="health">Health</SelectItem>
          </SelectContent>
        </Select>

        {/* Time range */}
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
