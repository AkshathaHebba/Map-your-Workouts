import Cycling from './Cycling';

describe('Cycling', function() {
  test('should be create with correct values.', () => {
    const workout = new Cycling({ distance: 1, duration: 1 });
    expect(workout.status).toBe('active');
    expect(workout.getJSON()).toEqual({
      'description': expect.any(String),
      'type': 'cycling',
      'speed': 60,
      'clicks': 0,
      'date': expect.any(String),
      'distance': 1,
      'duration': 1,
      'id': expect.any(String),
      'status': 'active'
    });
  });
});
