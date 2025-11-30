import { useState } from "react";
import { postAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import type { Post } from "../types";
import { Link } from "react-router-dom";
import CommentsList from "./CommentList";

interface PostProps {
    post: Post;
    onDelete?: () => void;
    onUpdate?: () => void;
}

const PostItem = ({post, onDelete}: PostProps) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(
        user ? post.likes.includes(user.id) : false
    );
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0); 

    const isAuthor = user?.id === post.author.id;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const handleLike = async () => {
        if (!user) return;

        try {
            if (isLiked) {
                await postAPI.unlike(post.id);
                setLikesCount((prev) => prev - 1);
            } else {
                await postAPI.like(post.id);
                setLikesCount((prev) => prev + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Failed to like/unlike post:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        setIsDeleting(true);
        try {
            await postAPI.delete(post.id);
            onDelete?.();
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

      const handleCommentCreated = () => {
        setCommentsCount((prev) => prev + 1); 
    };

    const handleCommentDeleted = () => {
        setCommentsCount((prev) => Math.max(0, prev - 1)); 
    };

    return(
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <div className="flex space-x-4">
            {/* Avatar */}
            <Link to={`/profile/${post.author.id}`}>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold hover:opacity-80 transition">
                    {post.author.username[0].toUpperCase()}
                </div>
            </Link>

            {/* Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <Link to={`/profile/${post.author.id}`}>
                            {post.author.username}
                        </Link>
                        <span className="text-gray-500 text-sm ml-2">
                            · {formatDate(post.createdAt)}
                        </span>
                    </div>
                    {/* Delete button for author */}
                    <div>
                        {isAuthor && (
                            <button onClick={handleDelete} disabled={isDeleting} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition">
                                {isDeleting? '...' : '🗑️'}
                            </button>
                        )}
                    </div>
                </div>
                {/* Post content */}
                <p className="mt-2 text-gray-800 whitespace-pre-wrap">{post.content}</p>
                {/* Images */}
                {post.images && post.images.length > 0 &&(
                    <div className="mt-3 grid gap-2">
                        {post.images.map((img, index) => (
                            <img key={index} src={img} alt="" className="rounded-xl max-h-96 object-cover">
                            </img>
                        ))}
                    </div>
                )}
                {/* Actions */}
                <div className="flex items-center space-x-6 mt-4">
                    {/* Like button */}
                    <button
                    onClick={handleLike}
                    disabled={!user}
                    className={`flex items-center space-x-2 transition ${
                        isLiked
                        ? 'text-red-500'
                        : 'text-gray-500 hover:text-red-500'
                    } ${!user && 'cursor-not-allowed opacity-50'}`}
                    >
                        <span>{isLiked ? '❤️' : '🤍'}</span>
                        <span>{likesCount}</span>
                    </button>

                    {/* Comment button - 新增 */}
                    <button
                    onClick={toggleComments}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition"
                    >
                        <span>💬</span>
                        <span>{commentsCount}</span>
                    </button>

                    {/* Share placeholder */}
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition">
                        <span>🔄</span>
                        <span>0</span>
                    </button>
                </div>
                {/* Comments Section - 新增 */}
                <CommentsList postId={post.id} isOpen={showComments} onCommentCreated={handleCommentCreated}
                    onCommentDeleted={handleCommentDeleted} />
            </div>
        </div>
    </div>);
};

export default PostItem;