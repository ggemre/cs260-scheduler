const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/test', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const courseSchema = new mongoose.Schema({
  title: String,
  rating: Number,
  description: String
});

// create a virtual paramter that turns the default _id field into id
// courseSchema.virtual('id')
//   .get(function() {
//     return this._id.toHexString();
//   });

// Ensure virtual fields are serialised when we turn this into a JSON object
courseSchema.set('toJSON', {
  virtuals: true
});

// create a model for tickets
const Course = mongoose.model('Course', courseSchema);

app.get('/api/courses', async (req, res) => {
  try {
    let courses = await Course.find();
    console.log(courses);
    res.send(courses);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/courses', async (req, res) => {
  const course = new Course({
    title: req.body.title,
    rating: req.body.rating,
    description: req.body.description
  });
  try {
    await course.save();
    res.send(course);
    console.log(course);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.listen(3001, () => console.log('Server listening on port 3001!'));