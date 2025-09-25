import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Share2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

type TrendCardProps = {
  query: string;
  categories: string[];
  search_volume: number;
  increase_percentage: number;
  related_queries?: string[];
  active: boolean;
  updatedAt?: string;
};

export function TrendCard({
  query,
  categories,
  search_volume,
  increase_percentage,
  related_queries = [],
  active,
  updatedAt,
}: TrendCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white/60 to-white/20 dark:from-gray-900/60 dark:to-gray-800/30 backdrop-blur-lg shadow-xl border border-white/20 rounded-2xl hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{query}</h2>
          <span
            className={`h-3 w-3 rounded-full ${
              active ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((c) => (
            <Badge
              key={c}
              variant="secondary"
              className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            >
              {c}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Search Volume</p>
            <p className="text-2xl font-bold">
              {search_volume.toLocaleString()}
            </p>
          </div>
          <Badge
            className={`px-3 py-1 text-sm ${
              increase_percentage >= 0
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {increase_percentage}%
          </Badge>
        </div>

        {/* Related Queries as hashtags */}
        {related_queries.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {related_queries.slice(0, 3).map((q) => (
              <span
                key={q}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                #{q.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <span>{updatedAt ? `Updated ${updatedAt}` : "Just now"}</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigator.clipboard.writeText(query)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
