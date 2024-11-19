import React, { useEffect } from 'react';
import axios from "axios";
import { useDispatch } from "react-redux";
import { setConversationUsers } from '../redux/messageSlice';
import { BASE_URL } from '..';

const useGetConversationUsers = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchOtherUsers = async () => {
            try {
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${BASE_URL}/api/message/users-conversation/${id}`);
                // store
                dispatch(setConversationUsers(res.data.data));
            } catch (error) {
                console.log(error);
            }
        }
        fetchOtherUsers();
    }, [])

}

export default useGetConversationUsers