import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // ramp up
    { duration: '2m', target: 100 }, // spike
    { duration: '1m', target: 0 }, // ramp down
  ],
};

export default function () {
  const res = http.get('http://localhost:4000/system-health');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.5);
}
