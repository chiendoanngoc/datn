import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

function getList() {
	return fetch('https://4wqlnxo1ld.execute-api.ap-southeast-1.amazonaws.com/create-scheduler').then(data => data.json())
}

function deleteScheduler(name) {
  let jsonData = {
    "Name": name
  }
	return fetch('https://4wqlnxo1ld.execute-api.ap-southeast-1.amazonaws.com/create-scheduler',{
    method: "DELETE",
    mode: "cors",
    body: JSON.stringify(jsonData)
  }).then(data => data.json()).then(() => {window.location.reload()})
}

export default function BasicTable() {
	const [rows, setRows] = useState([]);
	const [fetched, setFetched] = useState(null);

	useEffect(() => {
		getList()
			.then(items => {
				setRows(items);
				setFetched(true);
			})
	}, [])

	const handleDelete = (event, name) => {
		deleteScheduler(name).then(items => {console.log(items)});
	}

  return (
		<>
			{fetched ? <TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell><b>Group</b></TableCell>
							<TableCell align="right"><b>Name</b></TableCell>
							<TableCell align="right"><b>Created Date</b></TableCell>
							<TableCell align="right"><b>View</b></TableCell>
							<TableCell align="right"><b>Delete</b></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<TableRow
								key={row.name}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row">
									{row.GroupName}
								</TableCell>
								<TableCell align="right">{row.Name}</TableCell>
								<TableCell align="right">{row.CreationDate}</TableCell>
								<TableCell align="right">
									<Button variant="contained" color="success">
										View
									</Button>
								</TableCell>
								<TableCell align="right">
									<Button variant="contained" color="error" onClick={(e) => {handleDelete(e, row.Name)}}>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer> : <>processing</>}
		</>
  );
}
