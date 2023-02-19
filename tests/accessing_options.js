// option 1 

//  initialize the object ahead of time so that all of its properties are immediately visible


const proAnswers = {}; // answers object

inquirer.prompt([

  {
    type: 'input',
    name: 'title',
    message: 'What is the title of your project?',
    when: (answers) => answers.headings.includes('Project Title')
  },

])
  .then((result) => {
    Object.assign(proAnswers, result); // Add the answers to the object

    const markdown = generateMarkdown(proAnswers);
    console.log(markdown);
  })
  .catch((error) => {
    console.error('Error generating markdown:', error);
  });


// option 2
// start with an empty object and only add properties as they are needed

const { headings } = await inquirer.prompt([
  // prompts go here
]);

const answers = {
  about: '',
  story: '',
  features: '',
  languages: '',
  product: '',
  started: '',
  prerequisites: '',
  installation: '',
  usage: '',
  design: '',
  roadmap: '',
  tests: '',
  team: '',
  links: '',
  summary: '',
};

if (headings.includes('About the Project')) {
  answers.about = await inquirer.prompt([{
    type: 'input',
    name: 'about',
    message: 'Enter a more detailed project description:',
  }]);
}

if (headings.includes('User Story')) {
  answers.story = await inquirer.prompt([{
    type: 'input',
    name: 'story',
    message: 'Enter a User Story:',
  }]);
}

// add more prompts here...

const finalAnswers = {
  ...answers,
  headings: headings,
};


// might be better (and more organised) to keep all the prompts together,
// 

const inquirer = require('inquirer');
const generateMarkdown = require('./generateMarkdown');

// Prompt for the lightweight README
const standardQuestions = [
  {
    type: 'input',
    name: 'title',
    message: 'What is the title of your project?',
    validate: (input) => input !== '' || 'You must provide a project title.',
  },
  {
    type: 'input',
    name: 'description',
    message: 'Describe your project:',
    validate: (input) => input !== '' || 'You must provide a project description.',
  },
  {
    type: 'input',
    name: 'installation',
    message: 'How do you install your project?',
    default: 'npm install',
  },
  // More prompts go here
];

// Prompt for the professional README
const proQuestions = [
  {
    type: 'input',
    name: 'features',
    message: 'List some features of your project:',
  },
  {
    type: 'input',
    name: 'license',
    message: 'What license does your project use?',
  },
  {
    type: 'input',
    name: 'contributing',
    message: 'How can others contribute to your project?',
  },
  // More prompts go here
];

inquirer.prompt(standardQuestions)
  .then((standardAnswers) => {
    const answers = standardAnswers;

    // Ask professional questions if the user wants a professional README
    if (standardAnswers.type === 'professional') {
      return inquirer.prompt(proQuestions)
        .then((proAnswers) => {
          Object.assign(answers, proAnswers);
          return answers;
        });
    }

    return answers;
  })
  .then((answers) => {
    const markdown = generateMarkdown(answers);
    console.log(markdown);
  })
  .catch((error) => {
    console.error('Error generating markdown:', error);
  });
