import React, { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { Container, Row, Col, Button, Form, Table, Modal } from 'react-bootstrap';
import { Grid, Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import StatusCell from './StatusCell';
import { FaFilePdf } from "react-icons/fa";
import * as XLSX from 'xlsx';
import apiService from '../../../apiService';
import { toast } from 'react-toastify';
import EditJobModal from '../EditJobModal/EditJobModal';

import { FaTrash } from 'react-icons/fa';


import { RxDotFilled } from 'react-icons/rx';
const statusInfo = { 'jd-received': 'JD Received', 'profiles-sent': 'Profiles sent', 'drive-scheduled': 'Drive Scheduled', 'drive-done': 'Drive Done', 'not-interested': "Not Interested" }



const JobStats = ({ jobId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get(`/api/job-stats/${jobId}`);
        const statsData = response.data[0];
        console.log(statsData);
        setStats(statsData);
      } catch (err) {
        setError("Failed to fetch job stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [jobId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Total Applied
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.Students_applied}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Qualified
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.qualified}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Delayed
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.Students_delayed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Placed
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.placed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Not Placed
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.not_placed}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Not Attended
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.not_attended}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Not Interested
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.not_interested}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Not Eligible
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.not_eligible}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Eligible
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.eligible}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Under Progress
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.under_progress}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Level 01
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.level_1}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Level 02
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.level_2}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={2.4}>
          <Card variant="outlined">
            <CardContent>
              <Typography style={{ fontSize: "20px", fontWeight: "bolder", fontFamily: "Arial Narrow, sans-serif" }} align="center" gutterBottom>
                Level 03
              </Typography>
              <Typography variant="h4" align="center" color="primary">
                {stats.level_3}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};


const HrJobDesc = ({ jobId }) => {
  const [job, setJob] = useState({})
  const [selectedIds, setSelectedIds] = useState([]);
  const [data, setData] = useState([])
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [currentApplication, setCurrentApplication] = useState(null);


  useEffect(() => {
    fetchJobData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await apiService.get(`/api/applications/${jobId}`);
        console.log('jobId', jobId);
        console.log("DATA :", response.data);
        setData(response.data.map(item => ({ ...item, isEditing: false })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [job]);

  const fetchJobData = async () => {
    try {
      console.log("In method", jobId)
      const response = await apiService.get(`/api/view-jobs/${jobId}`);
      console.log("Response :", response.data)
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job data', error);
    }
  };

  const openCommentModal = (application) => {
    console.log("comment application opened for :", application);
    setCurrentApplication(application);
    setCurrentComment(application.comments || '');
    setShowCommentModal(true);
  };

  const handleSaveComment = async () => {
    try {
      const response = await apiService.put('/api/application-comment', {
        applicationID: currentApplication.applicationID,
        comments: currentComment,
      });

      if (response.status === 200) {
        setData(prevData =>
          prevData.map(item =>
            item.applicationID === currentApplication.applicationID
              ? { ...item, comments: currentComment }
              : item
          )
        );
        setShowCommentModal(false);
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleDelete = async (applicationID) => {
    try {
      const response = await apiService.delete(`/api/delete_application`, {
        params: { applicationID },
      });

      if (response.status === 200) {
        toast.success("Deleted Successfully");
        setData(prevData => prevData.filter(item => item.applicationID !== applicationID));
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };


  const updateStatus = async (applicationIDs, status) => {
    try {
      await apiService.put('/api/applications/status', { status, ids: applicationIDs });

      if (Array.isArray(applicationIDs)) {
        setData(prevData => prevData.map(app =>
          applicationIDs.includes(app.applicationID) ? { ...app, status, isEditing: false } : app
        ));
        setSelectedIds([]);
      } else {
        setData(prevData => prevData.map(app => app.applicationID === applicationIDs ? { ...app, status, isEditing: false } : app))
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };



  const toggleEditing = (applicationID) => {
    setData(prevData => prevData.map(app =>
      app.applicationID === applicationID ? { ...app, isEditing: !app.isEditing } : app
    ));
  };

  const handleCheckboxChange = (applicationID) => {
    setSelectedIds(prevSelectedIds => {
      if (prevSelectedIds.includes(applicationID)) {
        return prevSelectedIds.filter(id => id !== applicationID);
      } else {
        return [...prevSelectedIds, applicationID];
      }
    });
  };


  const handleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(app => app.applicationID));
    }
  };

  const memoColumns = useMemo(() => [
    {
      Header: (
        <Form.Check
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedIds.length === data.length && data.length > 0}
        />
      ),
      accessor: 'selection',
      Cell: ({ row }) => (
        <Form.Check
          type="checkbox"
          checked={selectedIds.includes(row.original.applicationID)}
          onChange={() => handleCheckboxChange(row.original.applicationID)}
        />
      ),
      disableSortBy: true,
      disableGlobalFilter: true,
    },
    { Header: 'ID', accessor: 'candidateID' },
    {
      Header: 'Full Name', accessor: 'fullName',
      Cell: ({ row }) => (
        <Link style={{ textDecoration: 'none', color: '#53289e', fontWeight: '800' }} to={`/HR_dash/student/${row.original.candidateID}`}>
          {row.original.fullName}
        </Link>
      )

    },
    { Header: 'Contact Number', accessor: 'mobileNo' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Domain', accessor: 'domain' },

    { Header: 'Degree', accessor: 'degree' },
    { Header: 'Branch', accessor: 'branch' },
    { Header: 'Gender', accessor: 'gender' },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row, value }) => (
        <StatusCell
          value={value}
          row={{ ...row, toggleEditing }}
          updateStatus={updateStatus}
          isEditing={row.original.isEditing}
        />
      )
    },
    { Header: 'Y.O.P', accessor: 'passedOut' },
    { Header: 'Experience', accessor: 'experience' },
    { Header: 'Resume', accessor: 'resume', disableSortBy: true },
    {
      Header: 'Comments',
      accessor: 'comments',
      Cell: ({ row }) => {
        const comment = row.original.comments;
        const truncatedComment = comment ? comment.split(' ')[0] + ' ...more' : 'Add Comment';

        return (
          <p
            style={{ cursor: 'pointer', textDecoration: comment ? 'none' : 'underline', color: '#007bff' }}
            onClick={() => openCommentModal(row.original)}
          >
            {truncatedComment}
          </p>
        );
      },
    },
    {
      Header: 'Delete',
      accessor: 'delete',
      disableSortBy: true,
      Cell: ({ row }) => (
        <FaTrash
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={() => handleDelete(row.original.applicationID)}
        />
      ),
    },

  ], [selectedIds, data]);

  const memoData = useMemo(() => data, [data]);


  // const downloadExcel = (completeData = false) => {


  //   const dataToExport = completeData ? memoData : page;
  //   console.log("Memo:", memoData);
  //   console.log("Page data:", page)
  //   // Map the data to include only the necessary columns
  //   const exportData = dataToExport.map(row => {
  //     const rowData = {};
  //     memoColumns.forEach(column => {
  //       if (column.accessor !== 'resume' && column.accessor !== 'selection') {
  //         // Safely access row.original or row.values based on the structure
  //         rowData[column.Header] = row.original
  //           ? row.original[column.accessor] // Use row.original if available
  //           : row[column.accessor] || ''; // Fallback to row[column.accessor]
  //       }
  //     });

  //     return rowData;
  //   });

  //   console.log("Exported", exportData); // Debugging: Check the mapped data


  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();


  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');

  //   const fileName = `JobApplications${completeData ? '_Complete' : ''}.xlsx`;

  //   XLSX.writeFile(workbook, fileName);

  // };

  // const downloadExcel = (completeData = false) => {
  //   const dataToExport = completeData ? memoData : page;

  //   // Map the data to include resume link
  //   const exportData = dataToExport.map(row => {
  //     const rowData = {};
  //     memoColumns.forEach(column => {
  //       if (column.accessor !== 'resume' && column.accessor !== 'selection') {
  //         // Safely access row.original or row.values based on the structure
  //         rowData[column.Header] = row.original
  //           ? row.original[column.accessor]
  //           : row[column.accessor] || '';
  //       }
  //     });

  //     // Add resume download link
  //     rowData['Resume Download'] = `http://localhost:5000/api/download-resume/${row.original.applicationID}`;

  //     return rowData;
  //   });

  //   const worksheet = XLSX.utils.json_to_sheet(exportData);
  //   const workbook = XLSX.utils.book_new();

  //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');

  //   const fileName = `JobApplications${completeData ? '_Complete' : ''}.xlsx`;

  //   XLSX.writeFile(workbook, fileName);
  // };


  const downloadExcel = (completeData = false) => {
    const dataToExport = completeData ? memoData : page;

    // Map the data to include a hyperlink for the resume
    const exportData = dataToExport.map(row => {
      const rowData = {};
      memoColumns.forEach(column => {
        if (column.accessor !== 'resume' && column.accessor !== 'selection' && column.accessor !== 'comments') {
          // Safely access row.original or row.values based on the structure
          rowData[column.Header] = row.original
            ? row.original[column.accessor]
            : row[column.accessor] || '';
        }
      });

      // Add resume hyperlink
      const resumeLink = `https://backend.ramanasoft.com:5000/api/download-resume/${row.original.applicationID}`;
      rowData['Resume Download'] = { f: `HYPERLINK("${resumeLink}", "Download")` }; // Add as a hyperlink

      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Process hyperlinks correctly for Excel
    Object.keys(worksheet).forEach(cell => {
      const cellValue = worksheet[cell].v;
      if (typeof cellValue === 'object' && cellValue.f) {
        worksheet[cell].f = cellValue.f; // Set hyperlink formula
        worksheet[cell].v = undefined; // Remove raw value
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');

    const fileName = `JobApplications${completeData ? '_Complete' : ''}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleResumeDownload = async (applicationId) => {
    try {
      console.log("Id:", applicationId);
      const url = `/api/download-resume/${applicationId.applicationID}`;
      console.log("Request URL:", url); // Log the URL for debugging
      const response = await apiService.getWithResponseType(url, 'blob');
      console.log("Resp", response);
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      console.log("Content", contentType)
      let extension = 'pdf'; // Default extension
      if (contentType.includes('application/pdf')) {
        extension = 'pdf';
      } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        extension = 'docx';
      } else if (contentType.includes('application/msword')) {
        extension = 'doc';
      }
      const blob = new Blob([response.data], { type: contentType });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `resume-${applicationId.fullName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };


  const handleEdit = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleSave = async (updatedJob) => {
    if (!job) {
      console.error("Original job data not available.");
      return;
    }

    const changedValues = {};

    // Determine which fields have changed
    for (let key in updatedJob) {
      if (updatedJob.hasOwnProperty(key) && job.hasOwnProperty(key)) {
        let value = updatedJob[key];

        if (value !== job[key]) {
          changedValues[key] = value;
        }
      }
    }

    // If no changes are detected, return early
    if (Object.keys(changedValues).length === 0) {
      toast.info("No changes detected.", { autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);
      console.log("changedValues :", changedValues);

      // Send the updated job data to the server
      const response = await apiService.post("/api/update-job", { changedValues, jobId: updatedJob.jobId });

      // Check if the response contains the "No changes detected" message
      if (response.data.message === "No changes detected") {
        toast.info("No changes were detected to update.", { autoClose: 5000 });
      } else {
        toast.success("Job updated successfully", { autoClose: 5000 });
        setShowModal(false);
        fetchJobData();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "There was an error updating the job!";
      console.error(errorMessage, error);
      toast.error(errorMessage, { autoClose: 5000 });
    } finally {
      setLoading(false);
    }

  };


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    state,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize
  } = useTable(
    { columns: memoColumns, data: memoData, initialState: { pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { globalFilter, pageIndex, pageSize } = state;
  console.log("Data:", data);
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => gotoPage(i)}
          style={{
            margin: '0 5px', outline: 'none', border: '1px solid #515357', fontWeight: '600',
            borderRadius: '2px', color: '#ffffff', padding: '5px 10px', cursor: 'pointer', backgroundColor: i === pageIndex ? '#416cb0' : '#9499a1'
          }}
        >
          {i + 1}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div style={{ width: "75vw" }}>
      <Container className='border p-3 rounded  mt-5'>
        <div className='d-flex justify-content-between'>
          <h1 className='fw-bold'>{job.companyName}</h1>
          <span style={{ border: '1px solid #fdf3c6', borderRadius: '5px', padding: '5px', fontSize: '10px', backgroundColor: '#fdf3c6', color: '#943d0e', fontWeight: '800', height: '30px' }}><RxDotFilled />{statusInfo[job.status]}</span>
        </div>

        <p><strong>Job ID:</strong> {job.jobId}</p>
        <p><strong>Job Title:</strong>{job.jobTitle} </p>
        <p><strong>Job Category:</strong> {job.jobCategory}</p>
        <p><strong>Job Type:</strong> {job.jobType}</p>
        <p><strong>City:</strong> {job.Location}</p>
        <p><strong>Experience :</strong> {job.jobExperience}</p>
        <p><strong>Qualification :</strong>{job.jobQualification}</p>
        <p><strong>Salary :</strong> {job.salary}</p>

        <p><strong>Description :</strong> {job.jobDescription}</p>
        <p><strong>Domains :</strong> {job.domains?.length ? job.domains.join(', ') : 'Not specified'}</p>
        <p><strong>Bond :</strong> {job.bond}</p>
        <p><strong>Available job openings :</strong> {job.openings}</p>

        <p><strong>Last date:</strong> {job.lastDate}</p>
        <h5 className='fw-bold text-danger mb-3'>Posted by: {job.name}</h5>
        <div className='d-flex justify-content-around w-25'>
          <Button
            variant="secondary"
            className='px-5'
            onClick={() => navigate(-1)}  // This will navigate back to the previous page
          >
            <span className='text-decoration-none text-dark fw-bold text-white text-nowrap'>
              <i className="fa-solid fa-left-long"></i> Back
            </span>
          </Button>
          <Button variant="primary" className='fw-bold ms-2 px-5' onClick={() => handleEdit(job)}>Edit</Button>
          <EditJobModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            job={selectedJob}
            handleSave={handleSave}
          />
        </div>
      </Container>
      {data.length > 0 ? (<Container fluid className='p-1' style={{ fontFamily: 'Calibri', width: '78vw' }}>

        <Row>
          <JobStats jobId={jobId} />
        </Row>
        <Row className='mb-3'>
          <Col>
            <h1>Students Applied</h1>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Col md={6}>
            <div className='d-flex align-items-center'>
              <p className='fw-bold me-2' style={{ fontSize: '20px' }}>
                Show
              </p>
              <Form.Select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                className='me-2'
                style={{ width: 'auto' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
              <p className='fw-bold' style={{ fontSize: '20px' }}>
                entries
              </p>
            </div>
          </Col>
          <Col md={6} className='d-flex justify-content-end align-items-center'>
            <Form.Label className='me-2 mb-0' style={{ fontSize: '20px', fontWeight: 'bold' }}>Search:</Form.Label>
            <Form.Control
              type="search"
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value || undefined)}
              placeholder="Search all columns"
              style={{ marginBottom: '10px', padding: '5px', height: '30px', border: '1px solid #737478', outline: 'none', borderRadius: '5px' }}
            />
          </Col>
        </Row>
        <Row className="mb-3 d-flex justify-content-between">
          <Col md={6} xs={10}>
            <Button onClick={() => downloadExcel(false)} style={{ height: '40px', marginRight: '10px', backgroundColor: '#6cde37', border: 'none', borderRadius: '5px', color: '#ffffff', fontWeight: 'bold', marginBottom: '5px' }}>
              Download Current Page as Excel
            </Button>
          </Col>
          <Col md={6} xs={8} lg={4} className="d-flex justify-content-end">

            <select onChange={(e) => updateStatus(selectedIds, e.target.value)} className='me-2' style={{ height: '35px', fontSize: '13px', border: '1px solid #737478', outline: 'none', borderRadius: '2px' }}>
              <option value="">Change Status</option>
              <option value="applied">Applied</option>
              <option value="qualified">Qualified</option>
              <option value="delayed">Delayed</option>
              <option value="placed">Placed</option>
              <option value="not-placed">Not Placed</option>
              <option value="not-attended">Not Attended</option>
              <option value="not-interested">Not Interested</option>
              <option value="not-eligible">Not Eligible</option>
              <option value="eligible">Eligible/Profile Sent</option>
              <option value="under-progress">Yet to Receive Feedback</option>
              <option value="level-1">Level 1</option>
              <option value="level-2">Level 2</option>
              <option value="level-3">Level 3</option>
            </select>
          </Col>

        </Row>
        <Row>
          <Col>{
            data.length > 0 ? (
              <Table {...getTableProps()} bordered hover responsive className='table-striped'>
                <thead className='table-dark'>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map(row => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          if (cell.column.id === 'resume') {
                            return (
                              <td {...cell.getCellProps()}>
                                <FaFilePdf
                                  onClick={() => handleResumeDownload(row.original)}
                                  style={{ cursor: 'pointer' }}
                                  size={20}
                                />
                              </td>
                            );
                          }
                          return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </Table>) : (<p>No data to show</p>)
          }

          </Col>
        </Row>
        <Row className='d-flex justify-content-between mt-3'>
          <Col md={4} style={{ width: '70%' }}>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage} className='btn btn-secondary'>
              Previous
            </Button>
            {renderPageNumbers()}
            <Button onClick={() => nextPage()} disabled={!canNextPage} className='btn btn-secondary ms-2'>
              Next
            </Button>
          </Col>


        </Row>
      </Container>) : (<p className='text-center'>No applied candidates</p>)}

      <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="comment">
            <Form.Control
              as="textarea"
              rows={3}
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveComment}>Save</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default HrJobDesc;
