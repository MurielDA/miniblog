import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { commentsAPI } from "../api";
import { AxiosError } from "axios";

interface CommentFormProps {
  postId: string;
  onCommentCreated: () => void;
}

const CommentForm = ({ postId, onCommentCreated }: CommentFormProps) => {

    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            setError('Please enter a comment');
            return;
        }

        if (content.length > 280) {
            setError('Comment must not exceed 280 characters');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await commentsAPI.create(postId, { content: content.trim() });
            setContent('');
            onCommentCreated();
        } catch (err) {
            if(err instanceof AxiosError){
                setError(err.response?.data?.message || 'Failed to create comment');
            }else{
                setError('Failed to create comment');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-4 text-gray-500">
                Please login to comment
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="border-t pt-4">
            <div className="flex space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.username[0].toUpperCase()}
                </div>

                {/* Input */}
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={2}
                    />

                    <div className="flex justify-between items-center mt-2">
                        <span
                        className={`text-sm ${
                            content.length > 280 ? 'text-red-500' : 'text-gray-400'
                        }`}
                        >
                        {content.length}/280
                        </span>

                        <button
                        type="submit"
                        disabled={isLoading || !content.trim() || content.length > 280}
                        className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                        {isLoading ? 'Posting...' : 'Comment'}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </form>
  );

}
export default CommentForm;