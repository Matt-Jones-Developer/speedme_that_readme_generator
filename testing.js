// insta-readme! The quick and dynamic readme builder.

// import inquirer from 'inquirer';

// inquirer
//   .prompt([
//     /* Pass your questions in here */
//     "What day is it?",
//     "Why can't I ever sleep??"
//   ])
//   .then((answers) => {
//     // Use user feedback for... whatever!!
//     "Some feedback"
//   })
//   .catch((error) => {
//     if (error.isTtyError) {
//       // Prompt couldn't be rendered in the current environment
//       console.log(error, "prompt couldn't be rendered in the current environment.")
//     } else {
//       // Something else went wrong
//       console.log("something else went wrong.")
//     }
//   });

// or this?

// import { isPrime } from './isPrime.js';

import inquirer from 'inquirer';

const answers = [];

async function promptUser() {
  // const promptUser = () =>
  const response = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your readme.md?'
    },
    {
      type: 'input',
      name: 'description',
      message: 'What is the projects description?'
    },
    {
      type: 'input',
      name: 'github',
      message: 'What is your github repo URL?'
    },
    {
      type: 'input',
      name: 'linkedin',
      message: 'Enter your LinkedIn URL.',
    },

  ]);

  console.log(response.title);

  // build array?

  // add each answer to an array called 'answers' ?
  // forEach + .push? A loop?
  for (let i = 0; i < answers.length; i++) {
    const element = answers[i];
    answers.push(element[i])
    console.log('forloop answers arrY:',answers)
    
  }
  answers.forEach(response => {
    answers.push(response)
    console.log('answers array:',answers) // e only 
  });

}


// import { prompt } from 'inquirer';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

// const promptUser = () =>
//   prompt([
//     {
//       type: 'input',
//       name: 'name',
//       message: 'What is your name?',
//     },
//     {
//       type: 'input',
//       name: 'location',
//       message: 'Where are you from?',
//     },
//     {
//       type: 'input',
//       name: 'hobby',
//       message: 'What is your favorite hobby?',
//     },
//     {
//       type: 'input',
//       name: 'food',
//       message: 'What is your favorite food?',
//     },
//     {
//       type: 'input',
//       name: 'github',
//       message: 'Enter your GitHub Username',
//     },
//     {
//       type: 'input',
//       name: 'linkedin',
//       message: 'Enter your LinkedIn URL.',
//     },
//   ]);

const generateHTML = (answers) =>
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Insta-README.MD</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Your readme project title: ${answers.title}</h1>
    <p class="lead">Project description: ${answers.description}.</p>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${answers.github}</li>
      <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;

promptUser()
  .then((answers) => writeFileAsync('index.html', generateHTML(answers)))
  .then(() => console.log('Successfully wrote to index.html'))
  .catch((err) => console.error(err));
