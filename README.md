# Workout Application

This is a workout application that allows users to track and map their workouts using geolocation. The application is built on a client-server architecture and utilizes various technologies and tools to provide a seamless experience for users. 

## Features

- **Geolocation and Marker Integration**: The application leverages geolocation APIs and provides a marker feature to capture location information during workouts. This allows users to precisely record their workout routes.

- **Client-Server Architecture**: The application is designed using a client-server architecture, where the client-side is developed using React, while the server-side is powered by Node.js and Express. This architecture ensures efficient communication and data flow between the front-end and back-end components.

- **Bundling and Consistency**: The application uses Webpack for bundling, which enables efficient packaging and optimization of the client-side code. Additionally, Babel is employed to maintain consistency across different web browsers, ensuring compatibility and smooth performance.

- **Database**: The backend of the application is built on MongoDB, a popular NoSQL database. MongoDB provides a flexible and scalable data storage solution, allowing seamless management and retrieval of workout data.

- **Deployment**: The application is deployed on Heroku, a cloud platform that enables easy and reliable hosting of web applications. Heroku provides a straightforward deployment process, ensuring that the application is accessible to users without any hassle.


## Application

<img width="1909" alt="Screen Shot 2023-06-07 at 6 25 40 PM" src="https://github.com/AkshathaHebba/mapty/assets/25522884/c159dadd-8e01-48d3-b642-7ccaa848a931">


## Flowchart

For a visual representation of the application's architecture and flow, refer to the flowchart provided below:
![Mapty-flowchart](https://github.com/AkshathaHebba/mapty/assets/25522884/37d613ed-fc6d-4ccd-a994-c028e12efae9)

## Architecture
![Mapty-architecture-final](https://github.com/AkshathaHebba/mapty/assets/25522884/f0513b96-6f95-4881-a978-f9a4643e77aa)


## Getting Started

To get started with the workout application, follow these steps:

1. Clone the repository from Git_Hub
2. Install the required dependencies by running `npm install` in both the client and server directories.(I suggest to look ar package.json to know whats being installed)
3. Configure the MongoDB connection in the server configuration files.
4. Build the client-side code using Webpack by running `npm run build` in the client directory.
5. Start the server by running `npm start` in the server directory.
6. Access the application by opening the provided URL(hosted on heroku) or navigating to `localhost:9000` in your browser.
