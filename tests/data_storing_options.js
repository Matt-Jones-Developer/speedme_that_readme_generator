const inquirer = require('inquirer');

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'What is your name?',
  },
  {
    type: 'input',
    name: 'email',
    message: 'What is your email address?',
  },
]).then((answers) => {
  // Object containing the user's answers
  const userData = {
    name: answers.name,
    email: answers.email,
  };

  // Alternatively, you can store the answers in an array of objects
  const userDataArray = [
    {
      name: 'name',
      value: answers.name,
    },
    {
      name: 'email',
      value: answers.email,
    },
  ];
});


// object version

async function myPrompts() {
  const responses = {};
  
  const nameResponse = await inquirer.prompt({
    type: 'input',
    name: 'name',
    message: 'What is your name?',
  });
  
  responses.name = nameResponse.name;
  
  const ageResponse = await inquirer.prompt({
    type: 'number',
    name: 'age',
    message: 'How old are you?',
  });
  
  responses.age = ageResponse.age;
  
  // Continue with the rest of your prompts
  
  console.log(responses);
}

myPrompts();
