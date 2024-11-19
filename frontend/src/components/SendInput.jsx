import React, { useState, useRef, useEffect } from 'react'
import axios from "axios";
import Picker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { IoSend } from "react-icons/io5";
import { BsEmojiSmileFill } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";
import { setMessages } from '../redux/messageSlice';
import { BASE_URL } from '..';


const SendInput = () => {

    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectImage, setSelectImage] = useState(null);
    const [imageSend, setImageSend] = useState(false);
    const [typing, setTyping] = useState(false);

    const { socket } = useSelector(store => store.socket);
    const { authUser, selectedUser } = useSelector(store => store.user);
    const { messages } = useSelector(store => store.message);

    // Listen for typing events
    useEffect(() => {
        socket?.on('userTyping', ({ senderId }) => {
            if (senderId == selectedUser?.id) {
                setTyping(true); // Set typing state to true
            }
        });

        socket?.on('userStopTyping', ({ senderId }) => {
            if (senderId == selectedUser?.id) {
                setTyping(false); // Set typing state to false
            }
        });

        // Clean up listeners when the component unmounts
        return () => {
            socket?.off('userTyping');
            socket?.off('userStopTyping');
        };
    }, [socket, selectedUser]);

    const handleFocus = () => {
        socket.emit("typing", { receiverId: selectedUser?.id });
    };

    const handleBlur = () => {
        socket.emit("stopTyping", { receiverId: selectedUser?.id });
    };

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (event) => {
        let msg = message;
        msg += event.emoji;
        setMessage(msg);
    };

    const fileUpdoadHandler = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const image = event.target.files[0];
        if (image) {
            setSelectImage(image);
            setMessage(image?.name);
            setImageSend(true);
        }
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            // Prepare FormData to send the message and file
            const formData = new FormData();
            formData.append("senderId", authUser?.id);
            formData.append("receiverId", selectedUser?.id);
            formData.append("isRead", false);

            // Add the file if it's selected othervise message 
            if (selectImage) {
                formData.append("image", selectImage);
            } else{
                formData.append("message", message);
            }

            const res = await axios.post(`${BASE_URL}/api/message/send`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res?.data?.success) {
                setImageSend(false);
                setSelectImage(null);  // Reset file input after sending
                dispatch(setMessages([...messages, res?.data?.data]));
            }
        } catch (error) {
            console.log(error);
        }
        setMessage("");
    }
    return (
        <>
            {/* Display typing indicator */}
            {typing && <p className='pl-7 text-sm text-white-900'>Typing...</p>}

            <form onSubmit={onSubmitHandler} className='flex px-5 mb-3'>
                <div>
                    <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                    {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                </div>
                <div className='w-full relative'>
                    <input
                        value={message}
                        disabled={imageSend}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        type="text"
                        placeholder='Send a message...'
                        className='border text-sm rounded-lg block w-full p-3 border-zinc-500 bg-gray-600 text-white'
                    />
                    <button
                        type="submit"
                        className='absolute flex inset-y-0 end-0 items-center pr-4'
                        disabled={!message}
                    >
                        <IoSend />
                    </button>
                </div>
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <MdAttachFile onClick={fileUpdoadHandler} />
                </div>
            </form>
        </>
    )
}

export default SendInput