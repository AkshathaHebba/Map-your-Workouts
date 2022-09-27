import Workout from '../models/Workout';

class Cycling extends Workout {
  type = 'cycling';

  constructor({ id, coords, distance, duration, elevation, date, status }) {
    super({ id, coords, distance, duration, date, status });
    this.elevation = elevation;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

export default Cycling
