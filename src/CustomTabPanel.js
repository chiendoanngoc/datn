import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import BasicTable from './BasicTable';
import ResendTable from './ResendTable';
import ReconcileTable from './ReconcileTable';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function createScheduler(name, groupname, expression, input) {
  let jsonData = {
    "Name": name,
    "GroupName": groupname,
    "ScheduleExpression": expression,
    "Input": input
  }
  // console.log(jsonData);
	return fetch('https://w0cpy7x8k7.execute-api.ap-southeast-1.amazonaws.com/prod/Schedule-service',{
    method: "POST",
    mode: "cors",
    body: JSON.stringify(jsonData)
  }).then(data => data.json())
}

function sendNotification(input) {
	return fetch('https://w0cpy7x8k7.execute-api.ap-southeast-1.amazonaws.com/prod/Notification-service',{
    method: "POST",
    mode: "cors",
    body: JSON.stringify(input)
  }).then(data => data.json())
}

function getCustomerList() {
	return fetch('https://w0cpy7x8k7.execute-api.ap-southeast-1.amazonaws.com/prod/Notification-service/customer')
         .then(data => data.json())
}

function getFormatList() {
	return fetch('https://w0cpy7x8k7.execute-api.ap-southeast-1.amazonaws.com/prod/Notification-service/format')
         .then(data => data.json())
}

function getGroupNameList() {
	return fetch('https://w0cpy7x8k7.execute-api.ap-southeast-1.amazonaws.com/prod/Schedule-service/group')
         .then(data => data.json())
}

export default function BasicTabs() {
  const [status, setStatus] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [company, setCompany] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [func, setFunc] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [to, setTo] = React.useState('');
  const [channel, setChannel] = React.useState('');
  const [appID, setAppID] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [format, setFormat] = React.useState();
  const [vars, setVars] = React.useState([{"count": 1, "name": "", "value": ""}]);
  const [name, setName] = React.useState('');
  const [groupName, setGroupName] = React.useState('');
  const [expression, setExpression] = React.useState('');
  const [customerList, setCustomerList] = React.useState([]);
  const [formatList, setFormatList] = React.useState([]);
  const [template, setTemplate] = React.useState('');
  const [groupNameList, setGroupNameList] = React.useState([]);
  const [fetched, setFetched] = React.useState(null);

  React.useEffect(() => {
		getCustomerList()
			.then(items => {
        setCustomerList(items);
			});
    getFormatList()
    .then(items => {
      setFormatList(items);
    });
    getGroupNameList()
    .then(items => {
      setGroupNameList(items);
    })
    setFetched(true);
	}, [fetched])

  const handleNameChange = (event) => {
    setName(event.target.value);
  }
  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  }
  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
  }
  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
  }
  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  }
  const handleFuncChange = (event) => {
    setFunc(event.target.value);
  }
  const handleToChange = (event) => {
    setTo(event.target.value);
  }
  const handleChannelChange = (event) => {
    setChannel(event.target.value);
  }
  const handleAppIDChange = (event) => {
    setAppID(event.target.value);
  }
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  }
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  }
  const handleFormatChange = (event) => {
    setFormat(event.target.value);
    setTemplate(event.target.value.Format);
  }
  const handleVarAdd = (e) => {
    setVars([...vars, {"count": vars.length+1, "name": "", "value": ""}]);
    console.log(vars);
  }
  const handleVarNameChange = (event, varCount) => {
    const foundIndex = vars.findIndex(x => x.count === varCount);
    const newVar = {"count": vars[foundIndex].count, "name": event.target.value, "value": vars[foundIndex].value};
    let newVars = vars;
    newVars[foundIndex] = newVar;
    setVars(newVars);
  }
  const handleVarValueChange = (event, varCount) => {
    const foundIndex = vars.findIndex(x => x.count === varCount);
    const newVar = {"count": vars[foundIndex].count, "name": vars[foundIndex].name, "value": event.target.value};
    let newVars = vars;
    newVars[foundIndex] = newVar;
    setVars(newVars);
  }
  const handleSubmit = (event, type) => {
    const notiRequest = {
      "company": company,
      "department": department,
      "function": func,
      "saving": saving,
      "data": [
        {
          "to": to,
          "channel": channel,
          "appID": appID,
          "title": title,
          "subject": subject,
          "format": format.FormatID,
          "var": vars
        }
      ]
    }
    if (type === "Notification") {
      sendNotification(notiRequest)
      .then(res => {
        // console.log(res);
        if (res === "Sending...") {
          setStatus(1);
        } else {
          setStatus(2);
        }
      });
    } else if (type === "Schedule") {
      // notiRequest.routeKey = "POST /send-noti";
      createScheduler(name, groupName, expression, notiRequest)
      .then(res => {
        // console.log(res);
        if (res === "Create fail!") {
          setStatus(4);
        } else {
          setStatus(3);
        }
      });
      setFetched(false);
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Notification" {...a11yProps(0)} />
          <Tab label="Resend" {...a11yProps(1)} />
          <Tab label="Schedule" {...a11yProps(2)} />
          <Tab label="Reconcile" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 2, width: '40ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <div>
              <TextField
                required
                fullWidth
                id="outlined-multiline-flexible"
                label="Company"
                value={company}
                onChange={handleCompanyChange}
              />
              <TextField
                required
                fullWidth
                id="outlined-multiline-flexible"
                label="Department"
                value={department}
                onChange={handleDepartmentChange}
              />
              <TextField
                required
                fullWidth
                id="outlined-multiline-flexible"
                label="Function"
                value={func}
                onChange={handleFuncChange}
              />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={saving} onClick={() => setSaving(!saving)}/>} label="Saving" />
              </FormGroup>
            </div>
            <div>
              <FormControl sx={{m: 2, width: '40ch'}}>
                <InputLabel id="demo-simple-select-label">To</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="To"
                  value={to}
                  onChange={handleToChange}
                >
                  {customerList.map((customer) => (
                    <MenuItem value={customer.CusID}>{customer.CusID}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{m: 2, width: '40ch'}}>
                <InputLabel id="demo-simple-select-label">Channel</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Channel"
                  value={channel}
                  onChange={handleChannelChange}
                >
                  <MenuItem value="pushapp">pushapp</MenuItem>
                  <MenuItem value="sms">sms</MenuItem>
                  <MenuItem value="email">email</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{m: 2, width: '40ch'}}>
                <InputLabel id="demo-simple-select-label">AppID</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="AppID"
                  value={appID}
                  onChange={handleAppIDChange}
                >
                  <MenuItem value="appID1">appID1</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <TextField
                required
                fullWidth
                id="outlined-multiline-flexible"
                label="Title"
                value={title}
                onChange={handleTitleChange}
              />
              <TextField
                required
                fullWidth
                id="outlined-multiline-flexible"
                label="Subject"
                value={subject}
                onChange={handleSubjectChange}
              />
              <FormControl sx={{m: 2, width: '40ch'}}>
                <InputLabel id="demo-simple-select-label">FormatID</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="FormatID"
                  value={format}
                  onChange={handleFormatChange}
                >
                  {formatList.map((format) => (
                    <MenuItem value={format}>{format.FormatID}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <TextField
              required
              fullWidth
              multiline
              id="outlined-multiline-flexible"
              label="Format"
              value={template}
            />
            {vars.map((eachVar) => (
              <div>
                <TextField
                  required
                  fullWidth
                  id="outlined-multiline-flexible"
                  label={"Var Name " + eachVar.count}
                  onChange={(e) => {handleVarNameChange(e, eachVar.count)}}
                />
                <TextField
                  required
                  fullWidth
                  id="outlined-multiline-flexible"
                  label={"Var Value " + eachVar.count}
                  onChange={(e) => {handleVarValueChange(e, eachVar.count)}}
                />
                <Button variant="contained" sx={{marginTop: 3, marginBottom: 3}} onClick={handleVarAdd}>Add Var</Button>
              </div>
            ))}
            <div>
              <Button variant="contained" sx={{margin: 1}} onClick={(e) => {handleSubmit(e, 'Notification')}}>Notify</Button>
            </div>
            {status === 2 ? <Alert severity="error">Send fail!</Alert> : <></>}
            {status === 1 ? <Alert severity="success">Sending...</Alert> : <></>}
          </div>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ResendTable />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <BasicTable />
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 2, width: '40ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              required
              id="outlined-required"
              label="Schedule name"
              onChange={handleNameChange}
              value={name}
            />
            <FormControl sx={{m: 2, width: '40ch'}}>
                <InputLabel id="demo-simple-select-label">Schedule group name</InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="ScheduleGroupName"
                  value={groupName}
                  onChange={handleGroupNameChange}
                >
                  {groupNameList.map((group) => (
                    <MenuItem value={group.Name}>{group.Name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            <TextField
              required
              id="outlined-required"
              label="Schedule expression"
              onChange={handleExpressionChange}
              value={expression}
            />
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 2, width: '40ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <div>
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Company"
                    value={company}
                    onChange={handleCompanyChange}
                  />
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Department"
                    value={department}
                    onChange={handleDepartmentChange}
                  />
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Function"
                    value={func}
                    onChange={handleFuncChange}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <FormGroup>
                    <FormControlLabel control={<Checkbox checked={saving} onClick={() => setSaving(!saving)}/>} label="Saving" />
                  </FormGroup>
                </div>
                <div>
                  <FormControl sx={{m: 2, width: '40ch'}}>
                    <InputLabel id="demo-simple-select-label">To</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="To"
                      value={to}
                      onChange={handleToChange}
                    >
                      {customerList.map((customer) => (
                        <MenuItem value={customer.CusID}>{customer.CusID}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl sx={{m: 2, width: '40ch'}}>
                    <InputLabel id="demo-simple-select-label">Channel</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Channel"
                      value={channel}
                      onChange={handleChannelChange}
                    >
                      <MenuItem value="pushapp">pushapp</MenuItem>
                      <MenuItem value="sms">sms</MenuItem>
                      <MenuItem value="email">email</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{m: 2, width: '40ch'}}>
                    <InputLabel id="demo-simple-select-label">AppID</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="AppID"
                      value={appID}
                      onChange={handleAppIDChange}
                    >
                      <MenuItem value="appID1">appID1</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                  <TextField
                    required
                    fullWidth
                    id="outlined-multiline-flexible"
                    label="Subject"
                    value={subject}
                    onChange={handleSubjectChange}
                  />
                  <FormControl sx={{m: 2, width: '40ch'}}>
                    <InputLabel id="demo-simple-select-label">FormatID</InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="FormatID"
                      value={format}
                      onChange={handleFormatChange}
                    >
                      {formatList.map((format) => (
                        <MenuItem value={format}>{format.FormatID}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <TextField
                  required
                  fullWidth
                  multiline
                  id="outlined-multiline-flexible"
                  label="Format"
                  value={template}
                />
                {vars.map((eachVar) => (
                  <div>
                    <TextField
                      required
                      fullWidth
                      id="outlined-multiline-flexible"
                      label={"Var Name " + eachVar.count}
                      onChange={(e) => {handleVarNameChange(e, eachVar.count)}}
                    />
                    <TextField
                      required
                      fullWidth
                      id="outlined-multiline-flexible"
                      label={"Var Value " + eachVar.count}
                      onChange={(e) => {handleVarValueChange(e, eachVar.count)}}
                    />
                    <Button variant="contained" sx={{marginTop: 3, marginBottom: 3}} onClick={handleVarAdd}>Add Var</Button>
                  </div>
                ))}
              </div>
            </Box>
            <div>
              <Button variant="contained" sx={{margin: 1}} onClick={(e) => {handleSubmit(e, 'Schedule')}}>Schedule</Button>
            </div>
            {status === 4 ? <Alert severity="error">Create fail!</Alert> : <></>}
            {status === 3 ? <Alert severity="success">Created!</Alert> : <></>}
          </div>
        </Box>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ReconcileTable />
      </CustomTabPanel>
    </Box>
  );
}
