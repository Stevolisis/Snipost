import React, { useState, useEffect, useRef, useCallback } from 'react' 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '../ui/button';
import { AtSign, Code, Link, X } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"
import api from '@/utils/axiosConfig';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { toast } from 'sonner';
import { addCommentSuccess, commentsFailure, loadCommentsStart } from '@/lib/redux/slices/comments';
import { disconnectWallet } from '@/lib/redux/slices/auth';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { renderText } from '@/utils/renderText';
import Image from 'next/image';

const CommentBox = () => {
    const [comment, setComment] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);
    const [showMentionsDropdown, setShowMentionsDropdown] = useState(false);
    const [mentionQuery, setMentionQuery] = useState("");
    const [mentionStartPos, setMentionStartPos] = useState(0);
    const [users, setUsers] = useState([]);
    const [mentions, setMentions] = useState([]);
    const textareaRef = useRef(null);
    const { jwtToken } = useAppSelector((state) => state.auth)
    const { snippet } = useAppSelector((state) => state.snippets);
    const dispatch = useAppDispatch();
    const [popoverKey, setPopoverKey] = useState(0);
    console.log("Users:", users);

    const fetchMentionedUsers = useCallback(async (query) => {
        try {
            const response = await api.get(`/get-mentioned-users/${query}`);
            if (response.data.success) {
                // Transform API response to match our expected format
                const formattedUsers = response.data.users.map(user => ({
                    id: user._id,
                    username: user.userName,
                    name: user.name,
                    entity: { _id: user._id },
                    model: "User",
                    avatar: user.avatar?.url
                }));
                setUsers(formattedUsers);
            }
        } catch (error) {
            console.error("Error fetching mentioned users:", error);
            toast.error("Failed to search users");
        }
    }, [mentionQuery]);

    // Track text selection and cursor position
    const handleTextareaChange = (e) => {
        setComment(e.target.value);
        setCursorPosition(e.target.selectionStart);
        
        const text = e.target.value;
        const beforeCursor = text.substring(0, e.target.selectionStart);
        const matchMention = beforeCursor.match(/(?:^|\s)%(\w*)$/);
        
        if (matchMention) {
            const query = matchMention[1];
            setMentionQuery(query);
            setMentionStartPos(beforeCursor.lastIndexOf("%") + 1);
            setShowMentionsDropdown(true);
            
            // Fetch users when query changes
            if (query.length > 1) { // Only search after 2 characters
                fetchMentionedUsers(query);
            }
        } else {
            setShowMentionsDropdown(false);
        }
    };
    // Focus and cursor position handling
    const focusTextareaWithCursor = (newPosition) => {
        if (textareaRef.current) {
            textareaRef.current.focus();
            setTimeout(() => {
                textareaRef.current.selectionStart = newPosition;
                textareaRef.current.selectionEnd = newPosition;
                setCursorPosition(newPosition);
            }, 0);
        }
    };

    // Handle inserting code markers
    const handleCodeClick = () => {
        const newText = insertTextAtCursor('`', '`');
        setComment(newText.text);
        focusTextareaWithCursor(newText.cursorPos);
    };
    
    // Handle inserting link markers
    const handleLinkClick = () => {
        const newText = insertTextAtCursor('*', '*');
        setComment(newText.text);
        focusTextareaWithCursor(newText.cursorPos);
    };
    
    // Handle inserting mention markers and show dropdown
    const handleMentionClick = () => {
        const newText = insertTextAtCursor(' ', '');
        setComment(newText.text);
        setMentionStartPos(cursorPosition + 1);
        setMentionQuery("");
        setShowMentionsDropdown(true);
        focusTextareaWithCursor(newText.cursorPos);
    };

    // Helper function to insert text at cursor position
    const insertTextAtCursor = (prefix, suffix) => {
        if (!textareaRef.current) return { text: comment, cursorPos: cursorPosition };
        
        const startPos = textareaRef.current.selectionStart;
        const endPos = textareaRef.current.selectionEnd;
        const selectedText = comment.substring(startPos, endPos);
        
        const before = comment.substring(0, startPos);
        const after = comment.substring(endPos);
        
        const text = before + prefix + selectedText + suffix + after;
        const newCursorPos = startPos + prefix.length + selectedText.length;
        
        return { text, cursorPos: newCursorPos };
    };

    // Select a user from the mention dropdown
    const selectUser = (user) => {
        const before = comment.substring(0, mentionStartPos - 1); // Remove the % part
        const after = comment.substring(cursorPosition);
        
        const newText = before + `%${user.username}%` + after;
        setComment(newText);
        setShowMentionsDropdown(false);
        
        // Add to mentions array
        const mentionObject = {
            entity: user.entity._id,
            model: user.model
        };
        
        if (!mentions.some(m => m.entity === mentionObject.entity)) {
            setMentions([...mentions, mentionObject]);
        }
        
        // Focus back on textarea with cursor after the mention
        const newPos = before.length + `%${user.username}%`.length;
        focusTextareaWithCursor(newPos);
    };


    const handleComment = async () => {
        if (comment === "") {
            toast.error("Comment cannot be empty");
            return;
        }

        try {
            const commentData = {
                contentId: snippet._id,
                contentType: snippet.codeBlocks ? "Snippet" : "Snap",
                text: comment,
                mentions: [
                    // Include the snippet creator
                    {
                        entity: snippet.user._id,
                        model: snippet.user.role === "developer" ? "User" : "Company"
                    },
                    // Include any other mentioned users
                    ...mentions]
            };

            await toast.promise(
                (async () => {
                    dispatch(loadCommentsStart());
                    const response = await api.post("/create-comment", commentData, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`
                        }
                    });
                    
                    dispatch(addCommentSuccess(response.data.comment));
                    setComment("");
                    setMentions([]);
                    return response.data;
                })(),
                {
                    loading: 'Posting your comment...',
                    success: (data) => data.message || 'Comment posted successfully!',
                    error: (err) => {
                        // Handle 401 specifically
                        console.log("ttttttttt: ", err);
                        if (err.response?.status === 401) {
                            dispatch(disconnectWallet()); // Clear auth state
                            // disconnect(); // Wallet disconnect logic
                            return 'Session expired. Please reconnect your wallet.';
                        }
                        
                        dispatch(commentsFailure(err.message));
                        return err.response?.data?.message || 'Failed to post comment';
                    }
                }
            );
            
        } catch (err) {
            console.error('Comment error:', err);
            // The toast.promise will have already handled the error display
        }
    };

    return (
        <div>
            <Tabs defaultValue="write" className="">
                <div className="flex justify-between items-center w-full">
                    <TabsList>
                        <TabsTrigger className="cursor-pointer" value="write">Write</TabsTrigger>
                        <TabsTrigger className="cursor-pointer" value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <div className='flex items-center gap-x-2'>
                        <Button variant='outline' onClick={handleCodeClick}>
                            <Code className="h-4 w-4" />
                        </Button>


                        <Popover open={showMentionsDropdown} onOpenChange={setShowMentionsDropdown} key={popoverKey}>
                            <PopoverTrigger asChild>
                                <Button variant='outline' onClick={handleMentionClick}>
                                    <AtSign className="h-4 w-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent 
                                className="p-0 w-60" 
                                align="start" 
                                side="bottom"
                                hidden={!showMentionsDropdown}
                            >
                                <Command>
                                    <CommandInput 
                                        placeholder="Search users..." 
                                        value={mentionQuery}
                                        onValueChange={(value) => {
                                            setMentionQuery(value);
                                            if (value.length > 1) {
                                                fetchMentionedUsers(value);
                                            }
                                        }}
                                    />
                                    <CommandEmpty>No users found</CommandEmpty>
                                    <CommandGroup>
                                        {users.map((user) => (
                                            <CommandItem 
                                                key={user.id} 
                                                onSelect={() => selectUser(user)}
                                                className="flex items-center"
                                            >
                                                {user.avatar ? (
                                                    <Image
                                                        src={user?.avatar} 
                                                        alt={user.username}
                                                        width={5}
                                                        height={5}
                                                        className="w-5 h-5 rounded-full mr-1 object-cover aspect-square"
                                                    />
                                                ) : (
                                                    <div className=" object-cover aspect-square w-5 h-5 text-xs rounded-full bg-primary/10 flex items-center justify-center mr-1">
                                                        {user.username[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span className='text-xs'>@{user.username}</span>
                                                <span className="ml-1 text-muted-foreground text-[10px]">{user.name}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        
                        <Button variant='outline' onClick={handleLinkClick}>
                            <Link className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <TabsContent value="write" className="mt-2">
                    <div>
                        <Textarea
                            ref={textareaRef}
                            placeholder="Comment here ..."
                            className="h-32"
                            value={comment}
                            onChange={handleTextareaChange}
                            onSelect={(e) => setCursorPosition(e.target.selectionStart)}
                        />
                    </div>
                    <div className='flex justify-between items-start mt-4'>
                        <div className='text-xs text-muted-foreground'>
                            <span>Type `code` for code, *link* for links, %username% to mention</span>
                        </div>
                        <Button onClick={handleComment}>Comment</Button>
                    </div>
                </TabsContent>

                <TabsContent value="preview">
                    <div className="min-h-32">
                        {comment ? (
                            <div className='break-all'>{renderText(comment,mentions)}</div>
                        ) : (
                            <p className="text-muted-foreground">Nothing to preview</p>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

            {mentions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {mentions.map((mention, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-1 bg-primary/10 text-xs px-2 py-1 rounded-md"
                        >
                            <AtSign className="h-3 w-3" />
                            <span>{users.find(u => u.entity._id === mention.entity)?.username || 'user'}</span>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 p-0 hover:bg-primary/20"
                                onClick={() => setMentions(mentions.filter((_, i) => i !== index))}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CommentBox;