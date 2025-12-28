import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import { useParams, Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Modal } from 'react-bootstrap';
import HrStatusCell from '../HrStatusCell';
import apiService from '../../../../apiService';
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';


const JobStatus = ({ statusInfo }) => {
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); const { status } = useParams();
  const [showDriveDateModal, setShowDriveDateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState([]);

  const [selectedJobId, setSelectedJobId] = useState();
  const [currentComment, setCurrentComment] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      console.log("Status is api call", status)
      try {
        const response = await apiService.get(`/api/view-jobs-status/?status=${statusInfo}`); // Adjust the URL as needed
        setData(response.data.map(item => ({ ...item, isEditing: false })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [status]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const updateStatus = async (jobId, status) => {
    try {
      await apiService.put(`/api/jobs/status`, { status, ids: Array.isArray(jobId) ? jobId : [jobId] });
      setData(prevData => prevData.map(app =>
        (Array.isArray(jobId) ? jobId.includes(app.jobId) : app.jobId === jobId) ? { ...app, status, isEditing: false } : app
      ));

      setSelectedIds([]); // Clear the selection after updating status
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const toggleEditing = (jobId) => {
    setData(prevData => prevData.map(app =>
      app.jobId === jobId ? { ...app, isEditing: !app.isEditing } : app
    ));
  };
  const openCommentModal = (job) => {
    setSelectedJob(job);
    setCurrentComment(job?.comments || '');
    console.log("Selected JobId", job.jobId);
    const jobId = job && job.jobId;
    setSelectedJobId(jobId);
    setShowDriveDateModal(true);
  };

  const memoColumns = useMemo(() => [

    {
      Header: 'Job ID', accessor: 'jobId',
      Cell: ({ row }) => (
        <Link style={{ textDecoration: 'none', color: 'blue', fontWeight: '600' }} to={`/SA_dash/job_desc/${row.original.jobId}`}>
          {row.original.jobId}
        </Link>
      )

    },
    { Header: 'Company Name', accessor: 'companyName' },
    { Header: 'Job Title', accessor: 'jobTitle' },

    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row, value }) => (
        <HrStatusCell
          value={value}
          row={{ ...row, toggleEditing }}
          updateStatus={updateStatus}
          isEditing={row.original.isEditing}
        />
      )
    },
    {
      Header: 'Posted Date', accessor: 'postedOn',
      Cell: ({ value }) => {
        value = formatDate(value)
        return <span>{value}</span>;
      }
    },
    {
      Header: 'Last Date', accessor: 'lastDate',
      Cell: ({ value }) => {
        value = formatDate(value)
        return <span>{value}</span>;
      }
    },
    {
      Header: 'Drive Date',
      accessor: 'DriveDate'
    },
    { Header: 'Posted BY', accessor: 'fullName' },
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
    }
  ], [selectedIds, data]);

  const memoData = useMemo(() => data, [data]);

  const downloadExcel = (completeData = false) => {

    const dataToExport = completeData ? memoData : page;
    console.log("Memo:", memoData);
    console.log("Page data:", page)
    // Map the data to include only the necessary columns
    const exportData = dataToExport.map(row => {
      const rowData = {};
      memoColumns.forEach(column => {
        if (column.accessor !== 'resume' && column.accessor !== 'selection') {
          // Safely access row.original or row.values based on the structure
          rowData[column.Header] = row.original
            ? row.original[column.accessor] // Use row.original if available
            : row[column.accessor] || ''; // Fallback to row[column.accessor]
        }
      });

      return rowData;
    });

    console.log("Exported", exportData); // Debugging: Check the mapped data


    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(workbook, worksheet, 'Job Applications');

    const fileName = `JobApplications${completeData ? '_Complete' : ''}.xlsx`;

    XLSX.writeFile(workbook, fileName);

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
  const renderPageNumbers = () => {
    const totalPages = Math.ceil(data.length / pageSize);
    const currentPage = pageIndex + 1; // Because pageIndex is 0-based
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = 5;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - 4;
    }

    const pageNumbers = [];

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) =>
      number === "..." ? (
        <span key={index} style={{ margin: "0 5px" }}>...</span>
      ) : (
        <Button
          key={index}
          onClick={() => gotoPage(number - 1)}
          style={{
            margin: "0 5px",
            color: number === currentPage ? "#ffffff" : "#515357",
            border: "1px solid #515357",
            borderRadius: "2px",
            backgroundColor: number === currentPage ? "#515357" : "#9499a1"
          }}
        >
          {number}
        </Button>
      )
    );
  };

  const handleSaveComment = async () => {
    try {
      const response = await apiService.put('/api/job-comment', {
        jobId: selectedJobId,
        comments: currentComment,
      });

      if (response.status === 200) {
        setData(prevData =>
          prevData.map(item =>
            item.jobId === selectedJobId
              ? { ...item, comments: currentComment }
              : item
          )
        );
        toast.success("Comment Updated Successfully")
        setShowDriveDateModal(false);
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  // const renderPageNumbers = () => {
  //   const pageNumbers = [];
  //   for (let i = 0; i < pageCount; i++) {
  //     pageNumbers.push(
  //       <Button
  //         key={i}
  //         onClick={() => gotoPage(i)}
  //         variant={i === pageIndex ? 'primary' : 'secondary'}
  //         style={{ margin: '0 5px', fontWeight: '600' }}
  //       >
  //         {i + 1}
  //       </Button>
  //     );
  //   }
  //   return pageNumbers;
  // };
  console.log(data)
  return (
    <>
      <Container fluid className="p-5" style={{ width: '79vw' }}>
        <Row className="mb-4">
          <Col>
            <h1>{statusInfo}</h1>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} className="d-flex align-items-center">
            <p className="fw-bold" style={{ fontSize: '20px' }}>
              Show
              <Form.Select
                className="ms-2 me-2"
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                style={{ width: 'auto', display: 'inline-block' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Select>
              entries
            </p>
          </Col>
          <Col md={6} className="d-flex justify-content-end align-items-center">
            <Form.Label className="me-2" style={{ fontSize: '20px', fontWeight: 'bold' }}>Search:</Form.Label>
            <Form.Control
              type="search"
              value={globalFilter || ''}
              onChange={e => setGlobalFilter(e.target.value || undefined)}
              placeholder="Search all columns"
              style={{ height: '30px', border: '1px solid #737478', outline: 'none', borderRadius: '2px' }}
            />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Button onClick={() => downloadExcel(false)} style={{ height: '40px', marginRight: '10px', backgroundColor: '#6cde37', border: 'none', borderRadius: '5px', color: '#ffffff', fontWeight: 'bold' }}>
              Download Current Page as Excel
            </Button>
            <Button onClick={() => downloadExcel(true)} style={{ height: '40px', backgroundColor: '#37a6de', marginRight: '10px', border: 'none', borderRadius: '5px', color: '#ffffff', fontWeight: 'bold' }}>
              Download Complete Data as Excel
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12} lg={12}>
            <Table {...getTableProps()} striped bordered hover responsive>
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{ backgroundColor: '#416cb0', color: '#ffffff' }}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {data.length > 0 ? (
                <tbody {...getTableBodyProps()}>
                  {page.map(row => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => (
                          <td
                            {...cell.getCellProps()}
                          >
                            {cell.render('Cell')}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              ) : (
                <tbody className="text-center w-100">
                  <tr><td colSpan={memoColumns.length}>No data to show</td></tr>
                </tbody>
              )}
            </Table>
          </Col>
        </Row>
        {data.length !== pageSize && (
          <Row className="mt-3">
            <Col className="d-flex justify-content-center">
              {/* Previous Button */}
              <Button
                style={{ color: '#ffffff', border: '1px solid #515357', borderRadius: '2px', backgroundColor: '#9499a1' }}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                &lt; Previous
              </Button>

              {/* Render Page Numbers */}
              {renderPageNumbers()}

              {/* Next Button */}
              <Button
                style={{ color: '#ffffff', border: '1px solid #515357', borderRadius: '2px', backgroundColor: '#9499a1' }}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next &gt;
              </Button>
            </Col>
          </Row>

        )}
      </Container>
      <Modal show={showDriveDateModal} onHide={() => setShowDriveDateModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowDriveDateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveComment}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default JobStatus;
