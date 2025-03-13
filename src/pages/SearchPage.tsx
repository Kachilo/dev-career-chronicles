
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BlogCard } from "../components/BlogCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useBlog } from "../context/BlogContext";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { posts } = useBlog();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  
  // Get search results
  const searchResults = query
    ? posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : [];
  
  // Sort results by date (newest first)
  const sortedResults = [...searchResults].sort((a, b) => 
    new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };
  
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
    }
    
    // Scroll to top on search
    window.scrollTo(0, 0);
  }, [searchParams]);

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Search Results
      </h1>
      
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-10 h-12"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>
      
      {query ? (
        <>
          <p className="text-muted-foreground text-center">
            Found {sortedResults.length} result{sortedResults.length !== 1 ? 's' : ''} for "{query}"
          </p>
          
          {sortedResults.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedResults.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try searching with different keywords or browse our categories.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Enter a search term to find articles
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
