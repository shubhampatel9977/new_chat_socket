import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import Message from './Message'
import useGetMessages from '../hooks/useGetMessages';
import { setMessages } from '../redux/messageSlice';
import useGetRealTimeMessage from '../hooks/useGetRealTimeMessage';


const Messages = () => {

    useGetMessages();
    useGetRealTimeMessage();
    const { messages } = useSelector(store => store.message);
    const { socket } = useSelector(store => store.socket);
    const { authUser, selectedUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket) {
            socket.on('messagesRead', ({ senderId, receiverId }) => {
                if (senderId == authUser?.id && receiverId == selectedUser?.id) {
                    // Update local messages state to mark them as read
                    const updatedMessages = messages.map(msg =>
                        msg.sender_id == senderId && !msg.is_read ? { ...msg, is_read: true } : msg
                    );
                    dispatch(setMessages(updatedMessages));
                }
            });

            return () => {
                socket.off('messagesRead');
            };
        }
    }, [socket, selectedUser, messages, authUser, dispatch]);

    return (
        <div className='px-4 flex-1 overflow-auto'>
            {
                messages && messages?.map((message) => {
                    return (
                        <Message key={message.id} message={message} />
                    )
                })
            }

        </div>
    )
}

export default Messages