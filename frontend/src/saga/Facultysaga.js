import {call,put,takeLatest} from 'redux-saga/effects'
import {getfacultypending,getfacultysuccess,getfacultyerror, updateFacultyRequest,
  updateFacultySuccess,
  updateFacultyFailure} from '../Redux/Facultyslice'
import axios from 'axios'
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';



//Worker saga
function * facultylist(action){
 try{
    const getres= yield call(axios.get,'http://localhost:5000/faculty/getfaculty',action.payload)
    console.log("response getting", getres)
    yield put(getfacultysuccess(getres.data))
 }
 catch(err){
    yield put(getfacultyerror(err))
 }
}

//update worker saga
function* updateFaculty(action) {
  const { facultyCode, formData, file, navigate } = action.payload;
  try {
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (!['Username', 'Email', 'FacultyCode'].includes(key)) {
        payload.append(key, formData[key] || '');
      }
    });
    if (file) payload.append('ProfilePicture', file);

    yield call(() =>
      axios.put(
        `http://localhost:5000/faculty/updatefaculty/${facultyCode}`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    );

    yield put(updateFacultySuccess());

    yield call(() =>
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Faculty details updated successfully.',
        confirmButtonColor: '#3085d6',
      }).then(() => navigate('/'))
    );
  } catch (error) {
    yield put(updateFacultyFailure(error.message));
    toast.error('Failed to update faculty data.');
  }
}




//Watcher Saga

function * facultywatcher(){
    yield takeLatest(getfacultypending.type,facultylist)
   yield takeLatest(updateFacultyRequest.type, updateFaculty);
}

export default facultywatcher