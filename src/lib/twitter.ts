// Twitter/X API service for real-time startup ecosystem data
// Uses bearer token authentication (Twitter API v2)

const TWITTER_BEARER_TOKEN = import.meta.env.VITE_TWITTER_BEARER_TOKEN;

export interface Tweet {
    id: string;
    text: string;
    author: string;
    handle: string;
    authorImage?: string;
    createdAt: string;
    metrics: {
        likes: number;
        retweets: number;
        replies: number;
    };
    url: string;
}

export interface TwitterTrend {
    name: string;
    tweetCount: number | null;
    url: string;
}

/**
 * Check if Twitter API is configured
 */
export function isTwitterConfigured(): boolean {
    return !!TWITTER_BEARER_TOKEN;
}

/**
 * Search recent tweets matching startup/VC/funding queries
 */
export async function searchTweets(query: string, maxResults = 10): Promise<Tweet[]> {
    if (!TWITTER_BEARER_TOKEN) return [];

    try {
        // Use backend proxy to avoid CORS (or direct if configured)
        const params = new URLSearchParams({
            query: `${query} -is:retweet lang:en`,
            max_results: String(maxResults),
            'tweet.fields': 'created_at,public_metrics,author_id',
            'user.fields': 'name,username,profile_image_url',
            expansions: 'author_id',
        });

        const res = await fetch(`https://api.twitter.com/2/tweets/search/recent?${params}`, {
            headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
        });

        if (!res.ok) {
            console.warn('Twitter API error:', res.status);
            return [];
        }

        const data = await res.json();
        if (!data.data) return [];

        const users = new Map(
            (data.includes?.users || []).map((u: any) => [u.id, u])
        );

        return data.data.map((t: any) => {
            const user = users.get(t.author_id) || { name: 'Unknown', username: 'unknown' };
            return {
                id: t.id,
                text: t.text,
                author: user.name,
                handle: `@${user.username}`,
                authorImage: user.profile_image_url,
                createdAt: t.created_at,
                metrics: {
                    likes: t.public_metrics?.like_count || 0,
                    retweets: t.public_metrics?.retweet_count || 0,
                    replies: t.public_metrics?.reply_count || 0,
                },
                url: `https://twitter.com/${user.username}/status/${t.id}`,
            };
        });
    } catch (err) {
        console.error('Twitter search failed:', err);
        return [];
    }
}

/**
 * Get trending topics (requires elevated access)
 */
export async function getTrends(woeid = 1): Promise<TwitterTrend[]> {
    if (!TWITTER_BEARER_TOKEN) return [];

    try {
        const res = await fetch(`https://api.twitter.com/1.1/trends/place.json?id=${woeid}`, {
            headers: { Authorization: `Bearer ${TWITTER_BEARER_TOKEN}` },
        });

        if (!res.ok) return [];

        const data = await res.json();
        return (data[0]?.trends || []).slice(0, 20).map((t: any) => ({
            name: t.name,
            tweetCount: t.tweet_volume,
            url: t.url,
        }));
    } catch {
        return [];
    }
}

/**
 * Curated search queries for startup founders
 */
export const FOUNDER_QUERIES = [
    { label: 'Active VC Capital', query: '("looking to invest" OR "new fund" OR "deploying capital") (seed OR pre-seed OR series A) -is:retweet' },
    { label: 'Open Grants', query: '(grant OR non-dilutive OR funding application) (open OR deadline OR apply) (startup OR founder) -is:retweet' },
    { label: 'Accelerators', query: '("applications open" OR "accepting applications") (accelerator OR incubator OR batch) -is:retweet' },
    { label: 'Angel Investors', query: '("angel investing" OR "writing checks" OR "syndicate") (startup OR founders) -is:retweet' },
    { label: 'Recent Funding', query: '("raised" OR "funding round") (startup) min_faves:50 -is:retweet' },
];
