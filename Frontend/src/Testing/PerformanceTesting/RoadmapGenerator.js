import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 100,
  duration: '10s',
};

// Replace this with a real token (from your app login or auth service)
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciIsInVzZXJfaWQiOiI3IiwidXNlcm5hbWUiOiJhbmphbGlzZXdtaW5pNUBnbWFpbC5jb20iLCJpYXQiOjE3NDgzNDcxMjYsImV4cCI6MTc0ODQzMzUyNiwic3ViIjoiYW5qYWxpc2V3bWluaTVAZ21haWwuY29tIn0.qM1tevoMwTg48WetkazZPTvzMIfq-c_QiN22kdIaVmU';

export default function () {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  let res = http.get('http://localhost:8080/api/roadmaps/rid/1', headers);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
