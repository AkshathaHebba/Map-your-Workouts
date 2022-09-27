class Workout {
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor ({ coords, distance, duration, date, id, status }) {
    this.id = id || (Date.now() + '').slice(-10);
    this.date = date ? new Date(date) : new Date();
    this.status = status || 'active';
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
    this.getJSON = this.getJSON.bind(this);
  }

  _setDescription () {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click () {
    this.clicks++;
  }

  getJSON () {
    const jsonObjectOfWorkout = Object.keys(this).filter((key) => (typeof this[key] !== 'function' && Object.prototype.hasOwnProperty.call(this, key))).reduce((acc, key) => ({
      ...acc,
      [key]: this[key]
    }), {});
    return JSON.parse(JSON.stringify(jsonObjectOfWorkout));
  }
}

export default Workout;
