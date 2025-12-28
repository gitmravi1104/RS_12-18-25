import React, { useEffect, useState, useMemo } from "react";
import { Container, Box, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import apiService from '../../../apiService';
import Cookies from 'js-cookie'

const months = [
    { value: "", label: "All Months" },
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
];

const PlacementReport = () => {
    const [rowData, setRowData] = useState([]);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalRow, setTotalRow] = useState(null);
    const [gridApi, setGridApi] = useState(null);
    const HRid = Cookies.get("HRid");


    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (year) params.year = year;
            if (month) params.month = month;
            if (HRid) params.hrId = HRid;

            const response = await apiService.get("/api/hr-placement-stats", { params });
            console.log("Response :", response);
            setRowData(response.data);
        } catch (err) {
            console.error("Error fetching placement report:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [year, month]);

    const calculateTotalsFromGrid = (api) => {
        let applications = 0;
        let NotEligible = 0;
        let profilesSent = 0;
        let attended = 0;
        let notAttended = 0;
        let selected = 0;
        let rejected = 0;
        let pending = 0;
        let jobs = 0;

        api.forEachNodeAfterFilterAndSort((node) => {
            const row = node.data;
            if (!row) return;
            jobs += 1;
            applications += Number(row.total_applications_received || 0);
            NotEligible += Number(row.not_eligible || 0);
            profilesSent += Number(row.profiles_sent || 0);
            attended += Number(row.attended || 0);
            notAttended += Number(row.not_attended || 0);
            selected += Number(row.selected || 0);
            rejected += Number(row.rejected || 0);
            pending += Number(row.pending || 0);
        });

        return {
            job_id: "Total:"+jobs,
            company_name: "",
            drive_date: "",
            role: "",
            domains: "",
            placement_officer: "",
            total_applications_received: applications,
            not_eligible: NotEligible,
            profiles_sent: profilesSent,

            attended: attended,
            not_attended: notAttended,
            selected: selected,
            rejected: rejected,
            pending: pending,
            comments: ""
        };
    };


    const columns = useMemo(() => [
        {
            headerName: "Job ID",
            sortable: true, filter: true,
            field: "job_id",
            cellRenderer: (params) => (
                <a
                    href={`/HR_dash/job_desc/${params.value}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#1976d2", fontWeight: 500 }}
                >
                    {params.value}
                </a>
            ),
            width: 120
        },
        {
            headerName: "Company", field: "company_name", minWidth: 180, sortable: true, filter: true
        },
        {
            headerName: "Drive Date",
            field: "drive_date",
            sortable: true, filter: true,

            valueFormatter: (p) =>
                p.value ? new Date(p.value).toLocaleDateString() : "-",
            width: 130
        },
        { headerName: "Role", field: "role", minWidth: 180, sortable: true, filter: true },
        { headerName: "Domains", field: "domains", minWidth: 160, sortable: true, filter: true },
        {
            headerName: "Total Applications",
            field: "total_applications_received",
            type: "numericColumn",
            width: 140,
            sortable: true, filter: true,

        },
        {
            headerName: "Not Eligible",
            field: "not_eligible",
            type: "numericColumn",
            width: 140,
            sortable: true, filter: true,
        },

        {
            headerName: "Profiles Sent",
            field: "profiles_sent",
            type: "numericColumn",
            width: 140,
            sortable: true, filter: true,
        },


        {
            headerName: "Attended",
            field: "attended",
            type: "numericColumn",
            sortable: true, filter: true,

            width: 120
        },
        {
            headerName: "Not Attended",
            field: "not_attended",
            type: "numericColumn",
            sortable: true, filter: true,

            width: 140
        },
        {
            headerName: "Selected",
            field: "selected",
            type: "numericColumn",
            sortable: true, filter: true,

            width: 140
        }, {
            headerName: "Rejected",
            field: "rejected",
            type: "numericColumn",
            sortable: true, filter: true,

            width: 140
        }, {
            headerName: "Pending",
            field: "pending",
            type: "numericColumn",
            sortable: true, filter: true,

            width: 140
        },
        {
            headerName: "Comments",
            field: "comments",
            sortable: true, filter: true,
            minWidth: 200,
            cellRenderer: (params) => (
                params.value && params.value.trim() !== "" ? params.value : "NA"
            )
        }
    ], []);

    /* Optional row styling */
    // const getRowStyle = (params) => {
    //     if (params.data?.not_attended > 0) {
    //         return { background: "#fff5f5" };
    //     }
    //     return null;
    // };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            {/* Filters */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <FormControl size="small" sx={{ width: 150 }}>
                    <InputLabel>Year</InputLabel>
                    <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
                        <MenuItem value="">All Years</MenuItem>
                        {[2023, 2024, 2025, 2026].map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ width: 180 }}>
                    <InputLabel>Month</InputLabel>
                    <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
                        {months.map((m) => (
                            <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* AgGrid */}
            {!loading ? (
                <div
                    className="ag-theme-alpine w-full mb-8"
                    style={{ height: 400, width: "auto" }}
                >
                    <AgGridReact
                        columnDefs={columns}
                        rowData={rowData}
                        pagination={true}
                        paginationPageSize={20}
                        enableCellTextSelection={true}
                        enableRangeSelection={true}
                        copyHeadersToClipboard={true}
                        pinnedBottomRowData={totalRow ? [totalRow] : []}

                        domLayout="autoHeight"

                        onGridReady={(params) => {
                            setGridApi(params.api);
                            const total = calculateTotalsFromGrid(params.api);
                            setTotalRow(total);
                        }}

                        onModelUpdated={(params) => {
                            const total = calculateTotalsFromGrid(params.api);
                            setTotalRow(total);
                        }}
                    />


                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </Container>
    );
};

export default PlacementReport;
