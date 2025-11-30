import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { postAPI } from "../api";
import type { Post as PostType } from "../types";
import { useAuth } from "../context/AuthContext";
import PostForm from "../components/PostForm";
import PostItem from "../components/PostItem";


const Home = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState<PostType[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useAuth();

    const fetchPosts = async(pageNum: number = 1, append: boolean = false) => {
        try{
            setIsLoading(true);
            const response = await postAPI.getAllPosts(pageNum, 10);
            const {data, pagination} = response.data.data;

            if(append){
                setPosts((prev)=>[...prev,...data]);
            }else{
                setPosts(data);
            }
            setHasMore(pageNum < pagination.totalPages);
        }catch(err){
            if(err instanceof AxiosError){
                setError(err.response?.data?.message || 'Failed to load posts');
            }else{
                setError('Failed to load posts');
            }

        }finally{
            setIsLoading(false);
        }
    }

    useEffect( () => {
        fetchPosts();
    },[]);

    const handlePostCreated = () => {
        fetchPosts(1, false);
        setPage(1);
    };

    const handlePostDeleted = () => {
        fetchPosts(1, false);
        setPage(1);
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, true);
    };

    return(
        <div className="max-w-2xl mx-auto">

            {/* Post Form - only for logged in users */}
            {user && <PostForm onPostCreated={handlePostCreated} />}

            {/* Error */}
            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
                {error}
                </div>
            )}
            {/* Posts List */}
            <div className="space-y-4">
                {posts.map((post) => (
                <PostItem
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                />
                ))}
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}
            {/* Load More Button */}
            {!isLoading && hasMore && posts.length > 0 && (
                <div className="text-center py-6">
                <button
                    onClick={loadMore}
                    className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
                >
                    Load More
                </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && posts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-4">🦗</p>
                <p>No posts yet. Be the first to post!</p>
                </div>
            )}
            
        </div>
    );


}

export default Home;