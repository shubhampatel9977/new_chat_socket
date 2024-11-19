import React, { useState } from 'react'
import { BiSearchAlt2 } from "react-icons/bi";
import ConversationUsers from './ConversationUsers';
import axios from "axios";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { setAuthUser, setOtherUsers, setSelectedUser } from '../redux/userSlice';
import { setMessages, setConversationUsers } from '../redux/messageSlice';
import { BASE_URL } from '..';
 
const Sidebar = () => {
    const [search, setSearch] = useState("");
    const {conversationUsers} = useSelector(store=>store.message);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            navigate("/login");
            toast.success('User logout successfully');
            dispatch(setAuthUser(null));
            dispatch(setMessages(null));
            dispatch(setConversationUsers(null));
            dispatch(setOtherUsers(null));
            dispatch(setSelectedUser(null));
        } catch (error) {
            console.log(error);
        }
    }

    const homePageHandler = () => {
        navigate('/home');
    }

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        const chatFilterUser = conversationUsers?.find((user)=> user.participants[0].fullName.toLowerCase().includes(search.toLowerCase()));
        if(chatFilterUser){
            dispatch(setConversationUsers([chatFilterUser]));
        }else{
            toast.error("User not found!");
        }
    }
    return (
        <div className='border-r border-slate-500 p-4 flex flex-col'>
            <form onSubmit={searchSubmitHandler} action="" className='flex items-center gap-2'>
                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    className='input input-bordered rounded-md' type="text"
                    placeholder='Search...'
                />
                <button type='submit' className='btn bg-zinc-700 text-white'>
                    <BiSearchAlt2 className='w-6 h-6 outline-none'/>
                </button>
            </form>
            <div className="divider px-3"></div> 
            <ConversationUsers/> 
            <div className='mt-2 flex justify-between'>
                <button onClick={logoutHandler} className='btn btn-sm'>Logout</button>
                <button onClick={homePageHandler} className='btn btn-sm'>Home Page</button>
            </div>
        </div>
    )
}

export default Sidebar