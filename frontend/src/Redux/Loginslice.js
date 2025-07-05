import {createSlice} from "@reduxjs/toolkit"


const Loginslice =createSlice({
    name:'Login',
    initialState:{
        loading:false,
        logindata:[],
        error:'null'
    },
    reducers:{
        loginpending:(state)=>{
            state.loading=true;
        },
        loginsucess:(state,action)=>{
            state.loading=false;
            state.logindata=action.payload;
        },
        loginerror:(state,action)=>{
            state.loading=false
            state.error=action.payload;
        }
    }
})


export const {loginpending,loginsucess,loginerror} =Loginslice.actions
export default Loginslice.reducer