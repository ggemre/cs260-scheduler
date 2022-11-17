import { useState, useEffect } from 'react';
import { Fab, TextField, Button, Rating, Dialog, DialogActions, DialogContent, 
         DialogContentText, DialogTitle, Stack, Paper, AppBar, Tooltip, styled } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [updatePage, setUpdatePage] = useState(false);
  
  const handleClickOpen = () => {
    setTitle("");
    setRating(0);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async () => {
    setOpen(false);
    await addCourse();
    setUpdatePage(true);
  };
  const handleDelete = async (c) => {
    await removeCourse(c.id);
    setUpdatePage(true);
  }
  const updateTitle = (event) => {
    setTitle(event.target.value);
  };
  const updateDescription = (event) => {
    setDescription(event.target.value);
  };
  
  const fetchCourses = async() => {
    try {
      const res = await axios.get("/api/courses");
      setCourses(res.data["courses"]);
    } catch (e) {
      console.log(e);
    }
  };
  
  const addCourse = async() => {
    try {
      await axios.post("/api/courses", { title: title, rating: rating, description: description });
    } catch (e) {
      console.log(e);
    }
  };
  const removeCourse = async(id) => {
    try {
      await axios.delete("/api/courses/" + id);
    } catch (e) {
      console.log(e);
    }
  };
  
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
  useEffect(() => {
    fetchCourses();
    setUpdatePage(false);
  }, [updatePage]);
  
  return (
    <div className="App">
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', top: 0, height: 50 }}>
        <h4>Rate my Course</h4>
      </AppBar>
    
      <Tooltip title="Add a rating">
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={ handleClickOpen } 
          sx={{ position: "absolute", bottom: 16, right: 16 }}
        >
          <Add />
        </Fab>
      </Tooltip>

      <Dialog open={ open } onClose={ handleClose }>
        <DialogTitle>Add Course Rating</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill out the fields below to add a new course rating.
          </DialogContentText>
          <TextField
            margin="dense"
            id="title"
            label="Course Title"
            variant="standard"
            required
            onChange={ updateTitle }
          /><br />
          <Rating
            name="course-rating"
            value={ rating }
            onChange={ (event, newValue ) => { setRating(newValue) }}
            precision={ 0.5 }
          /><br />
          <TextField
            margin="dense"
            id="description"
            label="Explain your Rating"
            variant="standard"
            onChange={ updateDescription }
            multiline
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleClose }>Cancel</Button>
          <Button onClick={ handleSubmit }>Submit</Button>
        </DialogActions>
      </Dialog>
      
      <Stack spacing={ 2 } sx={{ position: "relative", top: 70 }}>
        { courses.map(c => 
          <Item>
            <strong>{ c.title }</strong><br />
            <Rating value={ c.rating } readOnly /><br />
            { c.description }<br />
            <Tooltip title="Delete this rating">
              <Delete 
                onClick={ e => handleDelete(c) } 
              />
            </Tooltip>
          </Item>
        )}
      </Stack>
      
      <Paper sx={{ position: "fixed", bottom: 16, left: 16, fontWeight: "light", padding: 0.5 }}>
        <a href="https://github.com/ggemre/cs260-scheduler">GitHub Repo</a>
      </Paper>
    </div>
  );
}

export default App;
