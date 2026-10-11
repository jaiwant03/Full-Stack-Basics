# Experiment 6 - Node.js Student JSON REST API

## Aim

To develop a Node.js web application that serves student data from a local JSON
file through REST API endpoints and provides an interactive browser client for
viewing and searching student records.

## Requirements

- Node.js (v18 or later recommended)
- npm

## Installation and Run

From the project directory, install dependencies and start the application:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in a browser. The existing
responsive interface loads the student directory automatically. Use the student
ID lookup to search for an individual record; the JSON response area reports
loading, successful results, not-found responses, and connection errors.

For development with Node.js watch mode:

```bash
npm run dev
```

## Project Structure

```text
.
├── data/
│   └── students.json
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

## REST API Endpoints

### `GET /api/students`

Returns all student records as a JSON array with HTTP `200 OK`.

```bash
curl http://localhost:3000/api/students
```

### `GET /api/students/:id`

Returns one student object with HTTP `200 OK`. If the numeric ID does not exist,
returns HTTP `404 Not Found`:

```json
{
  "message": "Student not found"
}
```

Examples:

```bash
curl http://localhost:3000/api/students/1
curl -i http://localhost:3000/api/students/999
```

### `GET /api/status`

Returns a small health-check response for the browser UI:

```bash
curl http://localhost:3000/api/status
```

## Testing with Postman

1. Start the server with `npm start`.
2. Create a request with method `GET` and URL
   `http://localhost:3000/api/students`; send it and confirm a `200` status and
   a JSON array response.
3. Change the URL to `http://localhost:3000/api/students/1`; confirm a `200`
   status and one student object.
4. Change the URL to `http://localhost:3000/api/students/999`; confirm a `404`
   status and the `Student not found` message.

## Student Record Fields

Each record in `data/students.json` includes an `id`, `name`, `rollNo`,
`department`, `year`, `semester`, `email`, and `gpa`.
