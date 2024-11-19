import React, { useState, useEffect } from 'react'
import ConversationUser from './ConversationUser';
import useGetConversationUsers from '../hooks/useGetConversationUsers';
import { useSelector } from "react-redux";


const ConversationUsers = () => {

    const [typingUsers, setTypingUsers] = useState({});

    const { authUser } = useSelector(store => store.user);
    const { socket } = useSelector(store => store.socket);
    const { conversationUsers } = useSelector(store => store.message);
    useGetConversationUsers(authUser?.id);

    useEffect(() => {
        // Listen for typing events
        socket?.on('userTyping', ({ senderId }) => {
            setTypingUsers(prev => ({ ...prev, [senderId]: true }));
        });

        socket?.on('userStopTyping', ({ senderId }) => {
            setTypingUsers(prev => ({ ...prev, [senderId]: false }));
        });

        // Clean up listeners when the component unmounts
        return () => {
            socket?.off('userTyping');
            socket?.off('userStopTyping');
        };
    }, [socket]);

    if (!conversationUsers) return; // early return in react

    return (
        <div className='overflow-auto flex-1'>
            {
                conversationUsers?.map((message) => {
                    return (
                        <ConversationUser
                            key={message?.id}
                            message={message}
                            isTyping={typingUsers[message?.user_info?.id]}
                        />
                    )
                })
            }

        </div>
    )
}

export default ConversationUsers