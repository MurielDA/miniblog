import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { authAPI, postAPI } from "../api";
import PostItem from "../components/PostItem";
import type { Post as PostType, User } from "../types";



const Profile = () => {
    // init state
    const [isLoading, setIsLoading] = useState(false);
    const {user: currentUser} = useAuth();
    const {userId} = useParams<{userId: string}>();
    const [error, setError] = useState('');
    const [posts, setPosts] = useState<PostType[]>([]);
    const [profileInfo, setProfileInfo] = useState<User | null>(null);


    // isOwnProfile
    const isOwnProfile = currentUser?.id === userId;
    // useEffect

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            setIsLoading(true);
            setError('');
            try{
                
                const postsResponse = await postAPI.getPostsByUserId(userId, 1, 20);
                const fetchedPosts = postsResponse.data.data.data;
                setPosts(fetchedPosts);

                // set user info
                if(fetchedPosts.length > 0) {
                    const author = fetchedPosts[0].author;
                    setProfileInfo({
                        id: author.id,
                        username: author.username,
                        email: '',
                        avatarUrl: author.avatarUrl,
                        createdAt: '',
                    });
                }else if(isOwnProfile){
                    setProfileInfo(currentUser);
                }else{
                    const userResponse = await authAPI.getUserInfoById(userId);
                    setProfileInfo(userResponse.data.data.user);
                }

            }catch(err){
                if(err instanceof AxiosError){
                    setError(err.response?.data?.message || 'Failed to load profile');
                }else{
                    setError('Failed to load profile');
                }
            }finally{
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, [currentUser, userId, isOwnProfile]);

    const handlePostDeleted = async () => {
        if (userId) {
            try{
                const postsResponse = await postAPI.getPostsByUserId(userId, 1, 20);
                setPosts(postsResponse.data.data.data);
            }catch(err){
                if(err instanceof AxiosError){
                    setError(err.response?.data?.message || 'Failed to get latest post');
                }else{
                    setError('Failed to get latest post');
                }
            }
        };
    };
  

    if(isLoading){
        return(<div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>);
    }

    if(error){
        return(
        <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 text-red-500 p-4 rounded-xl">
                {error}
            </div>
        </div>);
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Profile Header */}

                {/* Avatar and Info */}

            <div className="max-w-2xl mx-auto">
                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 -mx-6 -mt-6 rounded-t-xl"></div>

                {/* Avatar and Info */}
                <div className="flex items-end -mt-12 mb-4">
                    <div className="w-24 h-24 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center text-white text-3xl font-bold">
                        {profileInfo?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                </div>

                <div className="flex space-x-6 mt-4 text-gray-600">
                    <div>
                        <span className="font-bold text-black">{posts.length}</span> Posts
                    </div>
                    <div>
                        <span className="font-bold text-black">0</span> Followers
                    </div>
                    <div>
                        <span className="font-bold text-black">0</span> Following
                    </div>
                </div>
                {/* Follow Button (for other users) */}
                    {!isOwnProfile && currentUser && (
                    <button className="mt-4 border border-orange-500 text-orange-500 px-6 py-2 rounded-full hover:bg-orange-50 transition">
                        Follow
                    </button>
                )}
            </div>
            {/* User's Posts */}
            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md mt-4">
                    <p className="text-4xl mb-4">📝</p>
                    <p>No posts yet</p>
                </div>
            ) : (
                <div className="space-y-4 mt-4">
                {posts.map((post) => (
                    <PostItem
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                    />
                ))}
                </div>
            )}
        </div>
        
    );



}
export default Profile;