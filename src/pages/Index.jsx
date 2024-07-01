import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function fetchTopStories() {
  return fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then((res) => res.json());
}

function fetchStory(id) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json());
}

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: storyIds, isLoading: isLoadingIds, error: errorIds } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const { data: stories, isLoading: isLoadingStories, error: errorStories } = useQuery({
    queryKey: ["stories", storyIds],
    queryFn: () => Promise.all(storyIds.slice(0, 100).map(fetchStory)),
    enabled: !!storyIds,
  });

  if (isLoadingIds || isLoadingStories) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
      </div>
    );
  }

  if (errorIds || errorStories) {
    return <div>Error loading stories.</div>;
  }

  const filteredStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-3xl text-center mb-4">Hacker News Top Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ul>
        {filteredStories.map((story) => (
          <li key={story.id} className="mb-4">
            <h2 className="text-xl">{story.title}</h2>
            <p>{story.score} upvotes</p>
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Read more
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Index;