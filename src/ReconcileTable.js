import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import * as Papa from 'papaparse';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function getList(start, end) {
	return fetch('https://w0cpy7x8k7.execute-api.ap-southeast-1.amazonaws.com/prod/Notification-service?status=sent&after='+start+'&before='+end+'/').then(data => data.json())
}

export default function ResendTable() {
	const [rows, setRows] = useState([]);
  const [fetched, setFetched] = useState(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(9999999999999);
  const [file, setFile] = useState(null);
  const [cusid, setCusid] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleStartChange = (e) => {
    // console.log(e.$d.getTime().toString());
    setStart(e.$d.getTime().toString());
  }

  const handleEndChange = (e) => {
    // console.log(e.$d.getTime().toString());
    setEnd(e.$d.getTime().toString());
  }

  const handleReconcileClick = (e) => {
    file.text().then(responseText => {
      let data = Papa.parse(responseText);
      data = data.data;
      let arrayLength = data.length;
      let newCusid = [];
      for (let i = 1; i < arrayLength-1; i++) {
        newCusid.push(data[i][0]);
      }
      setCusid(newCusid);
      setFetched(false);
    });
  }

	useEffect(() => {
		getList(start, end)
			.then(items => {
				setRows(items);
        setFetched(true);
			})
	}, [fetched, start, end, cusid]);

  return (
    <>
      <Box
        component="form"
        sx={{ m: 2, width: '40ch', justifyContent: 'center', alignItems: 'center' }}
        noValidate
        autoComplete="off"
      >
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          File
          <VisuallyHiddenInput type="file" onChange={handleFileChange} />
        </Button>
        <div>{file && `${file.name} - ${file.type}`}</div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker 
              label="Start date and time"
              onChange={handleStartChange}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker 
              label="End date and time"
              onChange={handleEndChange}
            />
          </DemoContainer>
        </LocalizationProvider>
        <Button variant="contained" color="success" sx={{ m: 2, width: '40ch' }} onClick={handleReconcileClick}>
          Reconcile
        </Button>
      </Box>
      {fetched ? <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell><b>NotiID</b></TableCell>
              <TableCell align="right"><b>To</b></TableCell>
              <TableCell align="right"><b>Content</b></TableCell>
              <TableCell align="right"><b>Resend times</b></TableCell>
              <TableCell align="right"><b>Channel</b></TableCell>
              <TableCell align="right"><b>Department</b></TableCell>
              <TableCell align="right"><b>Match?</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.NotiID}
                </TableCell>
                <TableCell align="right">{row.To}</TableCell>
                <TableCell align="right">{row.Content}</TableCell>
                <TableCell align="right">{row.Resend}</TableCell>
                <TableCell align="right">{row.Channel}</TableCell>
                <TableCell align="right">{row.Department}</TableCell>
                {file && <TableCell align="right">{cusid.includes(row.NotiID) ? "Match":"Not match"}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> : <>processing</>}
    </>
  );
}
