import {createSlice} from "@reduxjs/toolkit"


 const CourseSlice=createSlice({
    name:'course',
    initialState:{
        loadingDegree:false,
        loadingField:false,
        degree:[],
        Field:[],
        errorDegree:null,
        errorField:null
    },
    reducers:{
        getdegreepending:(state)=>{
            state.loadingDegree=true;
            state.errorDegree=null;
        },
        getdegreesuccess:(state,action)=>{
            state.loadingDegree=false;
            state.degree=action.payload;
        },
        getdegreefailure:(state,action)=>{
            state.loadingDegree=false;
            state.errorDegree=action.payload
        },
        getfieldpending:(state)=>{
            state.loadingField=true;
            state.errorField=null;
        },
        getfieldsuccess:(state,action)=>{
            state.loadingField=false;
            state.Field=action.payload
        },
        getfieldfailure:(state,action)=>{
            state.loadingField=false;
            state.errorField=action.payload;
        }
    }
 })

 export const {getdegreepending,getdegreesuccess,getdegreefailure,getfieldpending,getfieldsuccess,getfieldfailure} = CourseSlice.actions
 export default CourseSlice.reducer 