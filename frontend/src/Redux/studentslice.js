import {createSlice} from '@reduxjs/toolkit'


const studentslice=createSlice({
    name:'student',
    initialState:{
        loading:false,
        studata:[],
        error:'null',
    },
    reducers:{
        getstudentpending:(state)=>{
            state.loading=true;
        },
        getstudentsuccess:(state,action)=>{
            state.loading=false;
            state.studata=action.payload; 
        },
        getstudenterror:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        }
    }
})

export const {getstudentpending,getstudentsuccess,getstudenterror} =studentslice.actions
export default studentslice.reducer