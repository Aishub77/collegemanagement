import {call,put,takeLatest} from "redux-saga/effects"
import {getdegreepending,getdegreesuccess,getdegreefailure,getfieldpending,getfieldsuccess,getfieldfailure} from "../Redux/DegreeFieldslice"
import axios from 'axios'

//worker saga
function *fetchDegree(){
    try{
        const res=yield call(axios.get,'http://localhost:5000/degree/degreeget')
        yield put(getdegreesuccess(res.data));
    }
    catch(err){
         yield put(getdegreefailure(err))
    }
}

function *fetchFields(){
    try{
        const res=yield call(axios.get,'http://localhost:5000/Field/fieldget');
        yield put(getfieldsuccess(res.data));
    }
    catch(err)
    {
        yield put(getfieldfailure(err))
    }
}



//watcher saga
function * watchDegreeField(){
    yield takeLatest(getdegreepending.type,fetchDegree);
    yield takeLatest(getfieldpending.type,fetchFields);
}

export default watchDegreeField