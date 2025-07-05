import {call,put,takeLatest} from "redux-saga/effects"
import axios from 'axios'
import { getstudenterror,getstudentpending,getstudentsuccess}  from '../Redux/studentslice'

//Worker Saga
function * studentget(action){
    try{
        const res = yield call(axios.get,'http://localhost:5000/student/getstudent',action.payload)
        yield put(getstudentsuccess(res.data))  
        console.log(res.data,"studentget")
    }
    catch(err)
    {
        yield put(getstudenterror(err))
        console.log('error:',err)
    }
}

//watcher saga
function * watcherstudent(){
    yield takeLatest(getstudentpending.type,studentget)
}

export default watcherstudent