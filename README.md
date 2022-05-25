# Learner Dashboard (Platform to keep track of what you are learning)

## What is Learner Dashboard ?

- Learner Dashboard is a website where you can quickly see where you are in a course, what action items you may still have, and what courses you are currently enrolled in.
- Upon login, you will automatically be directed to your Learner Dashboard.
- Learners will only see the tabs and sections as applicable to them and their institution.

## REST API

This repo implements the backend REST API (built in Express + MongoDB).
A repository for with the frontend (React App) can be found here: https://github.com/HaThu6989/project-learning-client

## Running Instructions

To run in your computer, follow these steps:

- Clone
- Install dependencies: npm install
- Create a .env file with the following environment variables
  - ORIGIN, with the location of your frontend app (example, ORIGIN=https://myprojectname.netlify.com)
  - TOKEN_SECRET: used to sign auth tokens (example, TOKEN_SECRET=ilovemomdad)
- Run the application: npm run dev or npm start

## Learner DashBorad Demo

Follow the link to view the website demo:
https://project-learning.netlify.app/
