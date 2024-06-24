<a name="readme-top"></a>
<br />

<div align="center">
  <h1>My billboard charts</h1>

  <p align="center">
    Keep track of your spotify listening habits over time
  </p>
</div>

### Built With

<a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=react,nodejs,postgres,prisma,firebase" />
</a>

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This app relies on the configuration of several cloud tools. In order to properly run this locally, you'll need a firebase app setup as well as a spotify developer account with an application created and an API key. You'll also need postgres running locally with a new database create for this application.

### Run client

1. Change into client folder and install dependencies.

   ```bash
   > cd client
   > npm i
   ```

2. Create an empty `.env` file and copy `.env.sample` into `.env`. Use the key from your new firebase API.
3. Run in development mode:
   ```bash
   > npm run dev
   ```

### Run server

1. Change into server folder and install dependencies.

   ```bash
   > cd server
   > npm i
   ```

2. Create an empty `.env` file and copy `.env.sample` into `.env`. Make sure the spotify callback url is also included in you spotify developer portal. Use the other secrets from your firebase config. Generate a new session secret randomly. The database url should point to your postgres table.
3. Run in development mode:
   ```bash
   > npm run dev
   ```
