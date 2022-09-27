const express = require('express');
const mongoose = require('mongoose');
const Workout = require('./models/workout');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/workouts', async (req, res) => {
  const workouts = await Workout.find({ status: 'active' });
  return res.status(200).json(workouts);
});

app.delete('/workouts/:workoutId', async (req, res) => {
  const { workoutId } = req.params;
  console.log('workoutId', workoutId);
  const response = await Workout.updateOne({ id: workoutId }, { status: 'inactive' });
  res.status(200).send();
});

app.post('/workouts/:workoutId', async (req, res) => {
  const { workoutId } = req.params;
  console.log('workoutId', workoutId);
  console.log('req.body', req.body);
  const response = await Workout.updateOne({ id: workoutId }, { ...req.body });
  res.status(200).send();
});


app.post('/workouts', async (req, res) => {
  console.log('req.body', req.body);
  const workoutInstance = new Workout({
    ...req.body,
  })
  try {
    const dataToSave = workoutInstance.save();
    return res.status(200).json(dataToSave)
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
});

const start = async () => {
  try {
    const database = mongoose.connection;

    database.on('error', (error) => {
      console.log(error);
    });

    database.once('connected', () => {
      console.log('Database Connected');
    });

    await mongoose.connect('mongodb+srv://rhatwar:BcCvvHNb0L7lGPL3@cluster0.8csreiz.mongodb.net/mapty?retryWrites=true&w=majority');

    app.listen(3000, () => console.log('Server started on port 3000'));

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();