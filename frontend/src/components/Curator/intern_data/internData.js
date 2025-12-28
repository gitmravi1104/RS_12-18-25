import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiService from '../../../apiService';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const InternsTable = ({ currentInterns }) => {

  const columnDefs = [
    { headerName: 'Intern ID', field: 'candidateID', sortable: true, filter: true },
    {
      headerName: 'Full Name',
      field: 'fullName',
      sortable: true,
      filter: true,
      cellRenderer: params => (
        <Link
          to={`/curator/student/${params.data.candidateID}`}
          style={{ textDecoration: 'none', fontWeight: 'bold' }}
        >
          {params.value}
        </Link>
      )
    },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Mobile No', field: 'mobileNo', sortable: true, filter: true },
    { headerName: 'Domain', field: 'domain', sortable: true, filter: true },
    { headerName: 'Batch No', field: 'batchNo', sortable: true, filter: true },
    { headerName: 'Vasavi Foundation', field: 'belongedToVasaviFoundation', sortable: true, filter: true },
  ];

  const defaultColDef = {
    resizable: true,
    flex: 1,
    sortable: true,
    filter: true,
  };

  const rowClassRules = {
    "row-highlight": (params) => params.node.rowIndex % 2 === 0, // Alternate row styling
  };

  const customColumnDefs = columnDefs.map((col) => ({
    ...col,
    headerClass: "custom-header", // Custom header styling
    cellClass: "custom-cell", // Custom cell styling
  }));

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%" }}>
      <AgGridReact
        rowData={currentInterns}
        columnDefs={customColumnDefs}
        defaultColDef={defaultColDef}
        // onGridReady={onGridReady}
        pagination={true}
        paginationPageSize={15}
        domLayout="autoHeight"
        enableCellTextSelection={true}
        enableRangeSelection={true}
        copyHeadersToClipboard={true}
        rowClassRules={rowClassRules} // Apply row class rules
      />

      <style jsx>{`
      /* Custom header styling */
.custom-header {
  background-color: #4caf50;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  border-bottom: 2px solid #388e3c;
}

/* Custom cell styling */
.custom-cell {
  text-align: center;
  font-size: 0.9rem;
  color: #333;
  border-right: 1px solid #ddd;
}

/* Alternate row styling */
.row-highlight {
  background-color: #f5f5f5;
}

/* Pagination button styling */
.ag-paging-button {
  background-color: #4caf50 !important;
  color: white !important;
  border: none !important;
  border-radius: 4px;
  padding: 5px 10px;
  margin: 0 5px;
}

/* Hover effect for rows */
.ag-row:hover {
  background-color: #e0f7fa !important;
  cursor: pointer;
}

/* Grid header hover effect */
.ag-header-cell:hover {
  background-color: #66bb6a !important;
  color: white !important;
}

        @media (max-width: 768px) {
          .ag-theme-alpine {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .ag-theme-alpine {
            font-size: 10px;
          }
        }

        @media (max-width: 360px) {
          .ag-theme-alpine {
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
};



const InternTable = () => {
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.get('/api/intern_data');
        console.log(response.data)
        setInterns(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);


  return (
    <Container>
      <InternsTable currentInterns={interns} />
    </Container>
  );
};

export default InternTable;

