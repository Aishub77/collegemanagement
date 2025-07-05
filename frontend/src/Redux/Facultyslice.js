import {createSlice} from '@reduxjs/toolkit'


const facultyslice=createSlice({
    name:'faculty',
    initialState:{
    loading:false,
    facultyinput:[],
    error:null
    },
    reducers:{
        getfacultypending:(state)=>{
            state.loading=true;
        },
        getfacultysuccess:(state,action)=>{
            state.loading=false;
            state.facultyinput=action.payload;
        },
        getfacultyerror:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
       
    updateFacultyRequest: () => {},
    updateFacultySuccess: () => {},
    updateFacultyFailure: () => {},
    }
})


export const {getfacultypending,getfacultysuccess,getfacultyerror , updateFacultyRequest,
  updateFacultySuccess,
  updateFacultyFailure,} = facultyslice.actions
export default facultyslice.reducer