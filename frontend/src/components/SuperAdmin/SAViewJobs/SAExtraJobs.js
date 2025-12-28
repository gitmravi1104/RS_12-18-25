import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { MdEdit, MdDelete } from 'react-icons/md';
import { RxDotFilled } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import { FcExpired } from 'react-icons/fc';
import apiService from '../../../apiService';

const SAExtraJobs = () => {
  const currentDate = new Date();
  const [jobs, setJobs] = useState([]);
  const [hrList, setHrList] = useState([]);
  const [selectedHr, setSelectedHr] = useState({});

  useEffect(() => {
    fetchJobs();
    fetchHrList();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await apiService.get("/api/extra-jobs");
      const sortedJobs = response.data.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchHrList = async () => {
    try {
      const response = await apiService.get('/api/hr-list');
      setHrList(response.data);
    } catch (error) {
      console.error('Error fetching HR list', error);
    }
  };

  const handleDelete = async (job) => {
    try {
      await apiService.delete(`/api/delete-job/${job.jobId}`);
      toast.success("Job deleted successfully!", { autoClose: 5000 });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error(`There was an error deleting the job ${error}`, { autoClose: 5000 });
    }
  };

  const handleHrSelect = (jobId, hrId) => {
    setSelectedHr((prev) => ({ ...prev, [jobId]: hrId }));
  };

  const assignHrToJob = async (jobId) => {
    const hrId = selectedHr[jobId];
    if (!hrId) {
      toast.error("Please select an HR ID.", { autoClose: 3000 });
      return;
    }
  
    try {
      await apiService.put(`/api/assign-hr`, { jobId, postedBy: hrId });
      toast.success("HR assigned successfully!", { autoClose: 3000 });
      fetchJobs();
    } catch (error) {
      console.error("Error assigning HR:", error);
      toast.error("Error assigning HR. Please try again.", { autoClose: 3000 });
    }
  };
  

  return (
    <Container style={{ width: "1200px" }}>
      {jobs.length > 0 ? (
        <Row xs={1} sm={1} md={2} lg={3}>
          {jobs.map(job => (
            <Col key={job.jobId} style={{ marginBottom: "20px" }}>
              <div
                className="card h-100"
                style={{
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)',
                  borderRadius: '10px',
                  padding: '5px',
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold">{job.companyName}</h5>
                      <p className="card-subtitle mb-2 text-muted">{job.jobTitle}</p>
                    </div>

                    {new Date(job.lastDate) < currentDate && (
                      <span style={{ fontWeight: '500', color: '#fa3e4b' }}>
                        <FcExpired /> Applications closed
                      </span>
                    )}
                  </div>

                  <div>
                    <p><RxDotFilled /> <strong style={{ color: "black" }}>Job ID:</strong> {job.jobId}</p>
                    <p><RxDotFilled /> <strong style={{ color: "black" }}>Location: </strong>{job.Location}</p>

                    {job.postedBy ? (
                      <p><RxDotFilled /> <strong style={{ color: "black" }}>Posted By: </strong>{job.postedBy}</p>
                    ) : (
                      <div style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"5px"}}>
                        <select
                          className="form-control"
                          value={selectedHr[job.jobId] || ""}
                          onChange={(e) => handleHrSelect(job.jobId, e.target.value)}
                        >
                          <option value="">Select HR ID</option>
                          {hrList.map((hr) => (
                            <option key={hr.HRid} value={hr.HRid}>
                              {hr.HRid} - {hr.fullName}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-sm btn-primary mb-2"
                          onClick={() => assignHrToJob(job.jobId)}
                        >
                          Assign
                        </button>
                      </div>
                    )}

                    <p><RxDotFilled /> <strong style={{ color: "black" }}>Date Posted: </strong>{new Date(job.postedOn).toLocaleDateString()}</p>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <Link to={`/SA_dash/job_desc/${job.jobId}`}>
                      <button className="btn btn-outline-secondary mx-1"><FaAngleRight /> Details</button>
                    </Link>
                    <button className="btn btn-outline-danger mx-1" onClick={() => handleDelete(job)}>
                      <MdDelete /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No jobs available.</p>
      )}
    </Container>
  );
};

export default SAExtraJobs;
