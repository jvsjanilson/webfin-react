import React from "react";
import { Button, TextField, Select, MenuItem } from '@mui/material'
import Stack from '@mui/material/Stack'

const App = () => {
  return (
    <>
      <h1>App React</h1>
      <Stack spacing={2} direction="row">
      <Button  size="small" variant="text">Text</Button>
      <Button  size="small" variant="contained">Contained</Button>
      <Button  size="small" variant="outlined">Outlined</Button>
    </Stack>
    <br />
    <TextField variant="outlined" size="small" />

    <Select>
    <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
    </Select>
    
    </>
  );
}

export default App;