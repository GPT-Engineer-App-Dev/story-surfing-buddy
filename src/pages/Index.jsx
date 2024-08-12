import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Search, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

const fetchHNStories = async () => {
  const response = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100"
  );
  if (!response.ok) {
    throw new Error("Failed to fetch stories");
  }
  const data = await response.json();
  return data.hits.map(story => ({
    ...story,
    timeAgo: new Date(story.created_at).toLocaleString()
  }));
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["hnStories"],
    queryFn: fetchHNStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <h1 className="text-5xl font-bold mb-8 text-center text-white drop-shadow-lg">
        Top 100 Hacker News Stories
      </h1>
      <div className="relative mb-8 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search stories..."
          className="pl-10 pr-4 py-2 w-full bg-white/90 backdrop-blur-sm text-blue-900 rounded-full shadow-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredStories?.map((story) => (
            <motion.div
              key={story.objectID}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">{story.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-600 mb-2 flex items-center">
                    <User className="mr-1 h-4 w-4" /> {story.author}
                  </p>
                  <p className="text-sm text-blue-600 mb-2 flex items-center">
                    <Clock className="mr-1 h-4 w-4" /> {story.timeAgo}
                  </p>
                  <p className="text-sm text-blue-700 font-semibold mb-4">
                    Upvotes: {story.points}
                  </p>
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 inline-flex items-center transition-colors duration-200"
                  >
                    Read More <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Index;
