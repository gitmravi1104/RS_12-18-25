import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { store } from '../Context/ContextApi';

function ResultsFormate() {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.common.black,
            color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    const [results, setResults] = useContext(store);

    const getBackgroundColor = () => {
    if (data.Percentage < 83.33) return  "danger"; // Range: Less than 10
    return "success"; // Default for 30 and above
};
    // Normalize the object by trimming all keys
    const normalizedObject = results?.resultsTable?.[0] ? Object.fromEntries(
        Object.entries(results.resultsTable[0]).map(([key, value]) => [key.trim(), value])
    ) : {};

    // Get percentage (with fallback)
    const p = normalizedObject["Percentage"] ? parseFloat(normalizedObject["Percentage"]) : 0;

    // Build the data object using the normalized keys
    const data = {
        candidateName: normalizedObject["Candidate Name"] || "N/A",
        exam: normalizedObject.Exam || "N/A",
        examStatus: normalizedObject.examstatus || "N/A",
        marks: normalizedObject["Marks or Points"] || "N/A",
        percentage: p,  // Parsed percentage
        timeTaken: normalizedObject.TimeTaken || "N/A",
        rank: results?.meritResultsTable?.[0]?.Rank || "Not Qualified",
    };

    return (
        <div className='container'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <h5 className='fw-bold align-middle'>Score {p}%</h5>
<div className="progress w-100" role="progressbar" aria-valuenow={p} aria-valuemin="0" aria-valuemax="100">
  <div 
    className={`progress-bar ${p < 50 ? "bg-danger" : p < 83.33 ? "bg-warning" : "bg-success"} progress-bar-striped progress-bar-animated`} 
    style={{ width: `${p}%` }}
  >
    {p}%
  </div>
</div>

            </div>

            <div className='bg-details rounded p-4 mt-5'>
             

                <div className='row row-gap-4'>
                    <div className='col-lg-4'>
                        <TextField id="standard-basic" label="Candidate Name" variant="standard" value={data.candidateName} className='w-100' />
                    </div>
                    <div className='col-lg-4'>
                        <TextField id="standard-basic" label="Exam" variant="standard" value={data.exam} className='w-100' />
                    </div>
                    <div className='col-lg-4 '>
                        <TextField id="standard-basic" label="Exam Status" variant="standard" value={data.examStatus} className='w-100' />
                    </div>
                    <div className='col-lg-4'>
                        <TextField id="standard-basic" label="Score" variant="standard" value={data.marks} className='w-100' />
                    </div>
                    <div className='col-lg-4'>
                        <TextField id="standard-basic" label="Time Taken" variant="standard" value={data.timeTaken} className='w-100' />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultsFormate;



