import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import * as XLSX from 'xlsx';
import ResultsFormate from './ResultsFormate';
import { store } from '../Context/ContextApi';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import apiService from '../../apiService';
import './Results.css';

function Results() {



  const [searchErr, setSearchErr] = useState('');

  const [mobileValidation, setMobileValidation] = useState('')

  const [searchQuery, setSearchQuery] = useState('');

  const [message, setMessage] = useState('')

  const [results, SetResults] = useContext(store);

  const [response, setResponse] = useState([])

  const [mobile, setMobile] = useState('')

  const [isSearchPerformed, setIsSearchPerformed] = useState('')


  const regexMobileNo = new RegExp(/^[6-9][0-9]{9}$/);

  const [userInput, setUserInput] = useState('');


  // Handle change in search query
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setUserInput(value)
    setSearchQuery(e.target.value);
    setSearchErr('');
     setIsSearchPerformed('')
    regexMobileNo.test(value) ? setMobileValidation('') : setMobileValidation('Invalid Mobile Number')

  };


  // Handle search submit
  const handleSearchSubmit = (e) => {

    e.preventDefault();
    if (!searchQuery) {
        setSearchErr("Please Enter Mobile Number");
        return;
      } 	  
    console.log(searchQuery)
    setIsSearchPerformed(true)

    apiService.get(`/api/search?query=${searchQuery}`)
      .then((response) => {
        const results = response.data;
        console.log(response.data)
        if (results.resultsTable.length > 0) {
          // setSearchResults(results);
          setResponse(results.resultsTable)
          SetResults(results)
          console.log(results)
          setMessage('');
        } else {
          setMessage('No data available');
          // setSearchResults([]);
          SetResults([]);
         
        }
      })
      .catch((error) => {
        console.error('Error searching data:', error);
        setMessage('Error fetching data');
        // setSearchResults([]);
        SetResults([]);
        setResponse([]);
        setMobile(true)

      });

    



  };

  const handleKeyDown = (event) => {

    if (event.key === 'Enter') {

      if (!searchQuery) {
        setSearchErr("Please Enter Mobile Number");
        return;
      }

      handleSearchSubmit(event); // Call the same search function
    }
  };


  const searchInputRef = useRef(null);
  useEffect(() => {
    // Automatically focus the search bar when the component is mounted
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleKeyPress = (event) => {
    const charCode = event.which || event.keyCode;
    // Allow only numeric input (0-9) and special keys like backspace
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

 return (
    // <>
    //   <Header />
    //   <div>
    //     <div className='container' style={{ width: '100%', height: `${response.length > 0 ? '100vh' : '65vh'}` }}>
    //       <div className='row mt-2 '>
    //         <div className='col-sm-12 col-md-6 col-lg-6'>
    //           <h5 className='my-3 heading_text'>Get Your Results Using Mobile Number </h5>
    //         </div>
    //         <div className='col-sm-12 col-md-6 col-lg-6'>
    //           <form class="d-flex" role="search">
    //             <input
    //               class="form-control w-75"
    //               type="search"
    //               aria-label="Search"
    //               value={searchQuery}
    //               ref={searchInputRef}
    //               onChange={handleSearchChange}
    //               placeholder="Mobile Number"
    //               maxLength={10}
    //               // className='p-2 rounded text-center'
    //               onKeyDown={handleKeyDown} // Listen for Enter key
    //               onKeyPress={handleKeyPress}

    //             />
    //             <button class="btn btn-outline-success ms-3" type="submit" onClick={handleSearchSubmit}>Search</button>
    //           </form>
    //           <div className='text-center mt-2 me-5 '>
    //             {searchErr && <span className='text-danger'>{searchErr}</span>}
    //             {mobileValidation && <span className='text-danger'>{mobileValidation}</span>}
    //           </div>
    //         </div>


    //         {isSearchPerformed && (
    //           <div className='text-center text-danger mt-5' >
    //             {mobile && (
    //               response.length == 0 ? (
    //                 <>
    //                   <p>Data does not exist with mobile number: {userInput}</p>

    //                 </>
    //               ) : (
    //                 <></>
    //               )
    //             )}
    //           </div>
    //         )}
    //       </div>
    //       {response.length > 0 && <div className="results_format"> <ResultsFormate /> </div>}

    //     </div>
    //     <Footer />
    //   </div>

    // </>
    <>hi</>
  )
}


export default Results
