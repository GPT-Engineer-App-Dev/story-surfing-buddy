import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const fetchHNStories = async () => {
  const response = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["hnStories"],
    queryFn: fetchHNStories,
  });

  const filteredStories = data?.hits.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        className="mb-8 max-w-md mx-auto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <CardTitle className="h-6 bg-gray-300 rounded"></CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          : filteredStories?.map((story) => (
              <Card key={story.objectID}>
                <CardHeader>
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">
                    Upvotes: {story.points}
                  </p>
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline inline-flex items-center"
                  >
                    Read More <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default Index;
