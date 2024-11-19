import {createSlice} from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        messages:null,
        conversationUsers:null,
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages = action.payload;
        },
        setConversationUsers:(state,action)=>{
            state.conversationUsers = action.payload;
        },
    }
});
export const {setMessages,setConversationUsers} = messageSlice.actions;
export default messageSlice.reducer;