import {all} from 'redux-saga/effects'
import  Facultysaga from "./Facultysaga" 
import loginsaga from "./Loginsaga"
import studentsaga from "./studentsaga"
import coursessaga from './DegreeFieldsaga'


export  function * rootsaga(){
    yield all([Facultysaga(),loginsaga(),studentsaga(),coursessaga()])
}