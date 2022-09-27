import Cycling from './objects/Cycling';
import Running from './objects/Running';

import './images/icon.png';
import './images/logo.png';

import './styles/style.css';

class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._form = document.querySelector('.form');
    this._containerWorkouts = document.querySelector('.workouts');
    this._inputType = document.querySelector('.form__input--type');
    this._inputDistance = document.querySelector('.form__input--distance');
    this._inputDuration = document.querySelector('.form__input--duration');
    this._inputCadence = document.querySelector('.form__input--cadence');
    this._inputElevation = document.querySelector('.form__input--elevation');

    // Attach event handlers
    this._form.addEventListener('submit', this._newWorkout.bind(this));
    this._inputType.addEventListener('change', this._toggleElevationField.bind(this));
    this._containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));

    // Connect to Fetch Workout from DB
    this._loadWorkoutsFromDB().then(() => this._getPosition());
  }

  async _loadWorkoutsFromDB() {
    let data;
    try {
      data = await fetch('http://localhost:3000/workouts').then(response => response.json());
    } catch (e) {
      console.error('Error While Fetching Workouts');
    }

    if (!data) return;

    this.#workouts = data.map((dataItem) => dataItem.type === 'cycling' ? new Cycling(dataItem) : new Running(dataItem));

    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function() {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);

    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    this._form.classList.remove('hidden');
    this._inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    this._inputDistance.value = this._inputDuration.value = this._inputCadence.value = this._inputElevation.value =
      '';

    this._form.style.display = 'none';
    this._form.classList.add('hidden');
    setTimeout(() => (this._form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    this._inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    this._inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  async _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = this._inputType.value;
    const distance = +this._inputDistance.value;
    const duration = +this._inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +this._inputCadence.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        // !Number.isFinite(duration) ||
        // !Number.isFinite(cadence)
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Running({
        coords: [lat, lng], distance, duration, cadence
      });
    }

    // If workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +this._inputElevation.value;

      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers!');

      workout = new Cycling({
        coords: [lat, lng],
        distance,
        duration,
        elevation
      });
    }

    //
    try {
      console.log('workout', JSON.stringify(workout));
      console.log('workout JSON', JSON.stringify(workout.getJSON()));
      await fetch('http://localhost:3000/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workout.getJSON())
      });
    } catch (e) {
      console.error('Error in Inserting to DB', e);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + clear input fields
    this._hideForm();

  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
    workout.marker = marker;
  }

  async deleteWorkout(workout) {
    console.log('delete workout', workout);
    const response = await fetch(`http://localhost:3000/workouts/${workout.id}`, {
      method: 'DELETE'
    });
    if (response.status === 200) {
      console.log('workout deleted in db remove from UI', workout);
      const workoutElement = document.querySelector(`[data-id="${workout.id}"]`);
      workoutElement.remove();
      workout.marker.remove();
      this.#workouts.filter((workoutArrayItem) => workoutArrayItem.id !== workout.id);
    }

  }

  async editWorkout(workout) {
    if (document.querySelector(`[data-id='form-workout-edit-${workout.id}']`)) {
      return;
    }
    const html = `
      <form class='form' data-id='form-workout-edit-${workout.id}'>
          <div class='form__row'>
            <label class='form__label'>Type</label>
            <select class='form__input form__input--type' name='type' disabled>
              <option value='running' ${workout.type === 'running' ? 'selected': ''}>Running</option>
              <option value='cycling' ${workout.type === 'cycling' ? 'selected': ''}>Cycling</option>
            </select>
          </div>
          <div class='form__row'>
            <label class='form__label'>Distance</label>
            <input name='distance' class='form__input form__input--distance' placeholder='km' value='${workout.distance}'/>
          </div>
          <div class='form__row'>
            <label class='form__label'>Duration</label>
            <input
              name='duration'
              class='form__input form__input--duration'
              placeholder='min'
              value='${workout.duration}'
            />
          </div>
          
          ${workout.type === 'running' ? `
            <div class='form__row ${workout.type === 'running'? '': ' form__row--hidden'}'>
              <label class='form__label'>Cadance</label>
                <input
                  name='cadence'
                  class='form__input form_classNamet--cadence'
                  placeholder='step/min'
                  value='${workout.cadence}'
                />
            </div>
          ` 
         : ''}
          
           ${workout.type === 'cycling' ? `
            <div class='form__row ${workout.type === 'cycling'? '': 'form__row--hidden'}'>
              <label class='form__label'>Elev Gain</label>
              <input
                name='elevation'
                class='form__input form__input--elevation'
                placeholder='meters'
                value='${workout.elevation}'
              />
          </div>
          `
      : ''}
          <button class='form__btn'>OK</button>
        </form>
    `;
    const workoutElement = document.querySelector(`[data-id="${workout.id}"]`);
    workoutElement.insertAdjacentHTML('afterend', html);
    const workoutEditForm = document.querySelector(`[data-id='form-workout-edit-${workout.id}']`)
    workoutEditForm.onsubmit = (event) => this.onEditWorkout(workout, event);
  }

  async onEditWorkout(workout, event) {
    event.preventDefault();
    const formElements = event.target.getElementsByClassName('form__input')
    const updatedWorkoutValues = {};
    for (let i = 0; i < formElements.length; i++) {
      if (formElements[i].value || formElements[i].value !== "undefined") {
        updatedWorkoutValues[formElements[i].name] = formElements[i].value;
      }
    }
    try {
      const response = await fetch(`http://localhost:3000/workouts/${workout.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWorkoutValues)
      });
      if(response.status === 200) {
        location.reload()
      }
    } catch (e) {
      console.error('Error in Updating to DB', e);
    }
  }

  _renderWorkout(workout) {
    let html = `
      <li class='workout workout--${workout.type}' data-id='${workout.id}'>
        <h2 class='workout__title'>${workout.description} <span class='workout__icon workout-delete-${workout.id}'>❎</span> <span class='workout__icon workout-edit-${workout.id}'>📝</span></h2>
        <div class='workout__details'>
          <span class='workout__icon'>${
      workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
    }</span>
          <span class='workout__value'>${workout.distance}</span>
          <span class='workout__unit'>km</span>
        </div>
        <div class='workout__details'>
          <span class='workout__icon'>⏱</span>
          <span class='workout__value'>${workout.duration}</span>
          <span class='workout__unit'>min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class='workout__details'>
          <span class='workout__icon'>⚡️</span>
          <span class='workout__value'>${workout.pace.toFixed(1)}</span>
          <span class='workout__unit'>min/km</span>
        </div>
        <div class='workout__details'>
          <span class='workout__icon'>🦶🏼</span>
          <span class='workout__value'>${workout.cadence}</span>
          <span class='workout__unit'>spm</span>
        </div>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class='workout__details'>
          <span class='workout__icon'>⚡️</span>
          <span class='workout__value'>${workout.speed.toFixed(1)}</span>
          <span class='workout__unit'>km/h</span>
        </div>
        <div class='workout__details'>
          <span class='workout__icon'>⛰</span>
          <span class='workout__value'>${workout.elevation}</span>
          <span class='workout__unit'>m</span>
        </div>
      `;

    html += `
      </li>
    `;

    this._form.insertAdjacentHTML('afterend', html);

    document.getElementsByClassName(`workout-delete-${workout.id}`)[0].onclick = () => this.deleteWorkout(workout);
    document.getElementsByClassName(`workout-edit-${workout.id}`)[0].onclick = () => this.editWorkout(workout);
  }

  _moveToPopup(e) {
    // BUGFIX: When we click on a workout before the map has loaded, we get an error. But there is an easy fix:
    if (!this.#map) return;

    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1
      }
    });

    // using the public interface
    // workout.click();
  }
}

export default App;
