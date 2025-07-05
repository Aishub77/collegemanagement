import {call,put,takeLatest} from "redux-saga/effects" 
import {loginpending,loginsucess,loginerror} from '../Redux/Loginslice'
import axios from 'axios'

//worker saga

function * logingetdata(){
    try
    {
    const getdata= yield call(axios.get,'http://localhost:5000/register/me',
     {
       withCredentials:true
    })
    console.log(getdata);
    yield put(loginsucess(getdata.data))
    }
   catch(err){
    console.error(err);
    yield put(loginerror(err))
   }
}

//watcher saga

function * watcherlogin(){
    yield takeLatest(loginpending.type,logingetdata)
}

export default watcherlogin