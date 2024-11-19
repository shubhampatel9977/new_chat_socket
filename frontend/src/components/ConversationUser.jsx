import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import formatDate from "../helpers/formatDate";
import { setSelectedUser } from '../redux/userSlice';


const ConversationUser = ({ message, isTyping }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedUser, onlineUsers } = useSelector(store => store.user);
    const isOnline = onlineUsers?.includes(String(message?.user_info?.id));
    const selectedUserHandler = (user) => {
        dispatch(setSelectedUser(user));
        navigate('/chats');
    }
    return (
        <>
            <div onClick={() => selectedUserHandler(message?.user_info)} className={` ${selectedUser?.id === message?.user_info?.id ? 'bg-zinc-200 text-black' : 'text-white'} flex gap-2 hover:text-black items-center hover:bg-zinc-200 rounded p-2 cursor-pointer`}>
                <div className={`avatar ${isOnline ? 'online' : ''}`}>
                    <div className='w-12 rounded-full'>
                        <img src={message?.user_info?.profilePhoto} alt="user-profile" />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex justify-between'>
                        <p className='text-base'>{message?.user_info?.username}</p>
                        <p className='text-sm'>{formatDate(message?.createdAt)}</p>
                    </div>
                    {
                        isTyping ? (
                            <p className='text-sm text-green-600'>Typing...</p>
                        ) : (
                            message?.image_path ? (
                                <p className='text-sm'>Image</p>
                            ) : (
                                <p className='text-sm'>{message?.message}</p>
                            )

                        )
                    }
                </div>
            </div>
            <div className='divider my-0 py-0 h-1'></div>
        </>
    )
}

export default ConversationUser;
