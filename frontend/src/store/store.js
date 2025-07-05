import {configureStore} from '@reduxjs/toolkit'
import facultydetails from '../Redux/Facultyslice'
import logindetails from '../Redux/Loginslice'
import createSagaMiddleware from "redux-saga"
import {rootsaga} from '../saga/rootsaga';
import studentdetails from '../Redux/studentslice';
import coursedetails from '../Redux/DegreeFieldslice';


const sagaMiddleware =createSagaMiddleware();

const store=configureStore({
    reducer:{
        faculty:facultydetails,
        Login:logindetails,
        students:studentdetails,
        course:coursedetails

    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({thunk:false}).concat(sagaMiddleware)
})

sagaMiddleware.run(rootsaga)

export default store

