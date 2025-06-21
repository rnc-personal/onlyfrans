import { useState } from "react";

export default function SimpleFeed({ allPosts, initialLimit, incrementAmount }) {
  // State for how many posts to display
  const [displayCount, setDisplayCount] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  
  // Get only the posts we should display
  const postsToDisplay = allPosts.slice(0, displayCount);
  const hasMore = displayCount < allPosts.length;
  
  function loadMore() {
    setLoading(true);
    // Simulate network request for smoother UX
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + incrementAmount, allPosts.length));
      setLoading(false);
    }, 300);
  }

  // Helper: Format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  }

  // Helper: Format numbers
  function formatNumber(num) {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  console.log(`Displaying ${postsToDisplay.length} out of ${allPosts.length} total posts`);

  return (
    <div className="divide-y divide-gray-200" id="post-feed">
      {postsToDisplay.map((post, index) => (
        <article
          key={`${post.id}-${index}`}
          className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <img
                src={post.data.author.avatar}
                alt={post.data.author.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-gray-900">{post.data.author.name}</span>
                {post.data.author.verified && (
                  <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className="text-gray-500">{post.data.author.username}</span>
                <span className="text-gray-500">·</span>
                <span className="text-gray-500">{formatDate(post.data.publishedAt)}</span>
              </div>
              <div className="prose prose-sm max-w-none mb-3" dangerouslySetInnerHTML={{ __html: post.body }} />
              {post.data.image && (
                <div className="mb-3">
                  <img
                    src={post.data.image}
                    alt="Post image"
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <span>{formatNumber(post.data.replies)} replies</span>
                <span>{formatNumber(post.data.retweets)} retweets</span>
                <span>{formatNumber(post.data.likes)} likes</span>
              </div>
            </div>
          </div>
        </article>
      ))}
      {hasMore && (
        <div className="p-4 text-center" id="load-more-container">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-pink-500 text-white hover:bg-pink-600 focus:ring-pink-500 px-4 py-2 text-sm font-medium rounded-full transition-colors"
          >
            {loading ? "Loading..." : "Load more posts"}
          </button>
        </div>
      )}
      {allPosts.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <svg
            className="h-12 w-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg font-medium">No posts yet</p>
          <p className="text-sm">Be the first to share something!</p>
        </div>
      )}
    </div>
  );
}