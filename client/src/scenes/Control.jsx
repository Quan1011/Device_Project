import { useState } from "react";
import { 
  Box, 
  Select,
  Switch,
  Button, 
  Typography, 
  Container, 
  Slider, 
  MenuItem, 
  TextField,
} from "@mui/material";
import { 
  ArrowUpward, 
  ArrowBack, 
  ArrowForward, 
  ArrowDownward, 
  AddCircleOutline, 
  RemoveCircleOutline 
} from '@mui/icons-material';

export default function Control  ()  {
  const [selectedOption, setSelectedOption] = useState("");
  const [inputFrequency, setInputFrequency] = useState(2440);
  const [sliderFrequency, setSliderFrequency] = useState(0);


  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const sendDataChangeConfig = (value) => {
    // console.log("value send:", value);
      // const dataToSend = {
      //   // Dữ liệu bạn muốn gửi đến API
      //   frequencyCenter: Number(value) * 1000000,
        
      // };
    const url = 'http://192.168.38.134:54664/control'
    const data = Number(value) * 1000000
    const dataToSend = {
      "frequencyCenter": data,
      "frequencySpan": 44000000,
      "frequencyBins": 448,
      "referenceLevel": -20,
      "type": "capture"
    };
    sendPutRequest(url, dataToSend)
      .then(response => {
        console.log('Thành công:', response);
      })
      .catch(error => {
        console.error('Lỗi:', error);
      });
  };

  function sendPutRequest(url, jsonData) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(xhr.statusText));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network Error'));
      };

      xhr.send(JSON.stringify(jsonData));
    });
  }

  const handleInputChange  = (value) => {
    setInputFrequency(value);
    // send rp to API change config Spectran
    sendDataChangeConfig(value)
  };

  const handleFrequencyInputChange = (e) => {
    const newValue = e.target.value.replace(/[^\d.]/g, '');
    setInputFrequency(newValue);
    // console.log(newValue)
    // send rp to API change config Spectran
    sendDataChangeConfig(newValue);
    
  };

  const handleSliderChange = (event, newValue) => {
    setSliderFrequency(newValue);
  };


  return (
    <>
    <Container /*maxWidth="sm"*/ sx={{ display: 'flex', justifyContent: 'center'}}>
      <Box 
        sx={{
          margin: '15px', 
          padding: '15px', 
          width: '200px',
          borderRadius: '10px',
          backgroundColor: '#9092b0',
          // backgroundColor: theme.palette.secondary.light,
        }}
      >
        <Typography variant="h4">LNA Control</Typography>
        <Box sx={{ display: 'flex', padding: '42px 0 30px 0', alignItems: 'center'}}>
          <Typography>LNA:</Typography>
          <Switch defaultChecked />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography>Sweep Frequency:</Typography>
          <Select
            variant="standard"
            value={selectedOption}
            onChange={handleChange}
            // input={}
            sx={{ width: '60px', marginRight: '10px'}}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
          <Typography>Hz</Typography>
        </Box>
      </Box>
      <Box 
        sx={{
          margin: '15px', 
          padding: '15px', 
          backgroundColor: '#9092b0', 
          borderRadius: '10px', 
          width: '250px'
        }}>
        <Typography variant="h4">Frequency Control</Typography>
        <Box sx={{ display: 'flex', padding: '20px 0 20px 0', alignItems: 'center'}}>
          <Typography>Frequency Center:</Typography>
          <TextField
            type="text"
            value={inputFrequency}
            onChange={handleFrequencyInputChange}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            inputProps={{ inputMode: 'numeric' }}
            sx={{ 
              borderBottom: '1px solid #fff', 
              width: '80px', 
              paddingLeft: '10px', 
              textAlign: 'center', 
              marginRight: '25px' 
            }}
          />
          <Typography>MHz</Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <Button
            onClick={() => handleInputChange("2440")}
            sx={{ backgroundColor: "#fff", width: '100px', height: '50px' }}
          >
            <Typography sx={{color: 'black'}}>2.4GHZ</Typography>
          </Button>
          <Button
            onClick={() => handleInputChange("5800")}
            sx={{ backgroundColor: "#fff", width: '100px', height: '50px' }}
          >
            <Typography sx={{color: 'black'}}>5.8GHZ</Typography>
          </Button>
        </Box>
        <Box sx={{ display: 'flex', padding: '20px 0 20px 0', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography>Span:</Typography>
          <Select 
            variant="standard"
            sx={{ width: '60px' }}
            value={selectedOption}
            onChange={handleChange}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
          <Typography>MHz</Typography>
        </Box>
        <Box sx={{ display: 'flex', padding: '20px 0 20px 0', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography>Reference Level:</Typography>
          <Slider 
            defaultValue={sliderFrequency} 
            min={0} 
            max={100} 
            onChange={handleSliderChange}
            sx={{ width: '70px', marginRight: '20px' }}
          />
          <Typography sx={{ marginRight: '10px' }}>{sliderFrequency}</Typography>
          <Typography>dBm</Typography>
        </Box>
      </Box>
      <Box sx={{margin: '15px', padding: '15px', backgroundColor: '#9092b0', borderRadius: '10px', width: '250px'}}>
        <Typography variant="h4">Camera Control</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
          <Button sx={{backgroundColor: "#fff", height: '50px'}}>
              <ArrowUpward sx={{color: 'black'}} />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          <Button sx={{backgroundColor: "#fff", height: '50px'}}>
            <ArrowBack sx={{color: 'black'}} />
          </Button>
          <Button sx={{backgroundColor: "#fff", height: '50px'}}>
            <ArrowForward sx={{color: 'black'}} />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '5px'  }}>
          <Button sx={{backgroundColor: "#fff", height: '50px'}}>
              <ArrowDownward sx={{color: 'black'}} />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center' }}>
          <Button sx={{backgroundColor: "#fff" }}>
            <RemoveCircleOutline sx={{color: 'black' }} />
          </Button>
          <Typography>Zoom</Typography>
          <Button sx={{backgroundColor: "#fff"}}>
            <AddCircleOutline sx={{color: 'black'}} />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center' }}>
          <Button sx={{backgroundColor: "#fff"}}>
            <RemoveCircleOutline sx={{color: 'black'}} />
          </Button>
          <Typography>Focus</Typography>
          <Button sx={{backgroundColor: "#fff"}}>
            <AddCircleOutline sx={{color: 'black'}} />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', alignItems: 'center' }}>
          <Button sx={{backgroundColor: "#fff"}}>
            <RemoveCircleOutline sx={{color: 'black'}} />
          </Button>
          <Typography>Iris</Typography>
          <Button sx={{backgroundColor: "#fff"}}>
            <AddCircleOutline sx={{color: 'black'}} />
          </Button>
        </Box>
        <Box sx={{ display: 'flex', marginTop: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>Speed:</Typography>
          <Select 
            variant="standard"
            value={selectedOption}
            onChange={handleChange}
            sx={{
              width: '150px'
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </Box>
      </Box>
    </Container>
    </>
  );
}


