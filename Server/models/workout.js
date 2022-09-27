const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  "id": {
    "type": mongoose.Schema.Types.String
  },
  "clicks": {
    "type": "Number"
  },
  "date": {
    "type": mongoose.Schema.Types.Date
  },
  "coords": {
    "type": [
      mongoose.Schema.Types.Number
    ]
  },
  "distance": {
    "type": mongoose.Schema.Types.Number
  },
  "status": {
    "type": mongoose.Schema.Types.String
  },
  "duration": {
    "type": mongoose.Schema.Types.Number
  },
  "type": {
    "type": mongoose.Schema.Types.String
  },
  "cadence": {
    "type": mongoose.Schema.Types.Number
  },
  "pace": {
    "type": mongoose.Schema.Types.Number
  },
  "elevation": {
    "type": mongoose.Schema.Types.Number
  },
  "description": {
    "type": mongoose.Schema.Types.String
  }
});

const Workout = mongoose.model('workouts', WorkoutSchema);

module.exports = Workout;

const tets = {
  "id": "4156979543",
  "clicks": 0,
  "date": "2022-09-26T01:49:39.543Z",
  "coords": [37.595463875285645, -122.05673217773439],
  "distance": 1,
  "duration": 1,
  "type": "running",
  "cadence": 1,
  "pace": 1,
  "description": "Running on September 25"
};