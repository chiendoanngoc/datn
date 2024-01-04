import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function getList() {
	return fetch('https://4wqlnxo1ld.execute-api.ap-southeast-1.amazonaws.com/send-noti-reconcile').then(data => data.json())
}

export default function ResendTable() {
	const [rows, setRows] = useState([]);
  const [fetched, setFetched] = useState(null);

	useEffect(() => {
		getList()
			.then(items => {
				setRows(items);
        setFetched(true);
			})
	}, [])

  return (
    <>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> : <>processing</>}
    </>
  );
}
