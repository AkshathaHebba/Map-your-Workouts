import Workout from './Workout';

describe('Workout', function() {
  test('should be create with correct values.', () => {
    const workout = new Workout({ distance: 1, duration: 1})
    expect(workout.status).toBe('active');
    expect(workout.getJSON()).toEqual( {"clicks": 0, "date": expect.any(String), "distance": 1, "duration": 1, "id": expect.any(String), "status": "active"});
  });
});
