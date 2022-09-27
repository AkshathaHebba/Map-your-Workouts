import Workout from '../models/Workout';

class Running extends Workout {
  type = 'running';

  constructor({ id, coords, distance, duration, cadence, date, status }) {
    super({ coords, distance, duration, date, id, status });
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

export default Running
