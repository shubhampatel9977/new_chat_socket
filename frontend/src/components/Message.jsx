import React, { useEffect, useRef } from 'react'
import { useSelector } from "react-redux";
import setImagePath from "../helpers/setImagePath";


const Message = ({ message }) => {

    // Check if the message is read
    const isRead = message?.is_read;

    const scroll = useRef();
    const { authUser, selectedUser } = useSelector(store => store.user);

    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    // Helper function to format timestamp in AM/PM
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true // This enables the AM/PM format
        }).toUpperCase();
    };

    return (
        <div ref={scroll} className={`chat ${message?.sender_id === authUser?.id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img alt="Tailwind CSS chat bubble component" src={message?.sender_id === authUser?.id ? authUser?.profilePhoto : selectedUser?.profilePhoto} />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50 text-white">{formatTime(message?.createdAt)}</time>
            </div>
            {message?.image_path ? (
                <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''} `}>
                    <img
                        src={setImagePath(message?.image_path)}
                        alt="image"
                    />
                </div>
            ) : (
                <div className={`chat-bubble ${message?.senderId !== authUser?._id ? 'bg-gray-200 text-black' : ''} `}>{message?.message}</div>
            )}

            {/* Show read/unread status */}
            {message?.sender_id === authUser?.id && (
                isRead ? (
                    <span className="text-xs text-green-500">Read</span>
                ) : (
                    <span className="text-xs text-blue-500">Unread</span>
                )
            )}
        </div>
    )
}

export default Message