import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as XLSX from 'xlsx';

function Upload() {


  const [file, setFile] = useState(null);

  const [btn1, setBtn1] = useState(true)
  const [btn2,setBtn2]=useState(true)

  const fileInputRef1 = useRef(null)
  const fileInputRef2 = useRef(null)

  const handleFileChange = (event) => {
    const file = event.target.files[0];
   
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      setFile(file);
      setBtn1(false)
    } else {
      alert('Please select a valid Excel file (.xls or .xlsx)');
      event.target.value = ''; // Clear the input
      setBtn1(true)
      
    }

   
  };

  const handleFileUpload = (e) => {


    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Send the data to the backend
      axios.post('http://194.238.17.64:8080/api/upload', jsonData)
        .then(response => {
          console.log('Data uploaded successfully', response);
          alert("File uploaded successfully!");
        })
        .catch(error => {
          console.error('Error uploading data', error);
        });
    };
    reader.readAsBinaryString(file);
    // alert("sucessfully");
    // console.log('File uploaded successfully!'); // Simulate file upload
    if (fileInputRef1.current) {
      fileInputRef1.current.value = '';
     // Clear the file input
    }

    setBtn1(true)

    
  }

  const handleFileChangeMerit=(event)=>
  {

    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      setFile(file);
      setBtn2(false)
    } else {
      alert('Please select a valid Excel file (.xls or .xlsx)');
      event.target.value = '';
      setBtn2(true) // Clear the input
    }

    
    
  }

  const handleFileUploadMerit=()=>
  {
        
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Get the first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Send the data to the backend
      axios.post('http://194.238.17.64:8080/api/upload/merit', jsonData)
        .then(response => {
          console.log('Data uploaded successfully', response);
          alert("File uploaded successfully!");
        })
        .catch(error => {
          console.error('Error uploading data', error);
        });
    };
    reader.readAsBinaryString(file);
    // alert("sucessfully");
    // console.log('File uploaded successfully!'); // Simulate file upload
    if (fileInputRef2.current) {
      fileInputRef2.current.value = '';
     // Clear the file input
    }

    setBtn2(true)

  }

  return (
    <>


      <div className='container '>

        <div className='row'>

          <div className='col-6 border-end border-3 border-dark'>

            <div className="mt-5">
              {/* First Row */}
              <div className="mb-3">
                <h5 className="text-center">Upload Results file (Results.xlsx)</h5>
              </div>

              {/* Second Row */}
              <div className="d-flex justify-content-center align-items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef1}
                  className="me-3"
                />
                <button
                  onClick={handleFileUpload}
                  className="btn btn-success fw-bold px-3"
                  disabled={btn1}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div className='col-6'>
            <div className="mt-5">
              {/* First Row */}
              <div className="mb-3">
                <h5 className="text-center">Upload MeritResults file (Results.xlsx)</h5>
              </div>

              {/* Second Row */}
              <div className="d-flex justify-content-center align-items-center">
                <input
                  type="file"
                  onChange={handleFileChangeMerit}
                  ref={fileInputRef2}
                  className="me-3"
                />
                <button
                  onClick={handleFileUploadMerit}
                  className="btn btn-success fw-bold px-3"
                  disabled={btn2}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



    </>
  )
}

export default Upload
