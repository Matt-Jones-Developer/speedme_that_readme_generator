import inquirer from 'inquirer';
import fs from 'fs/promises';

// readme_type is called first 
const readme_type = await inquirer
  .prompt([
    {
      type: 'list',
      name: 'setup',
      message: 'Please select your type of readme:',
      // offer a list option
      choices: ['Lightweight', 'Professional'],
      // press enter for default
      default: 'Professional'
    }
  ])

// log the answers (for setup)
const setUpReadme = await inquirer
  .prompt([
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your project?'
    },
    {
      type: 'input',
      name: 'description',
      message: 'What is the project description?'
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

    console.info('Here is a summary of the project:',
      `\n${setUpReadme.title}.\n ${description}.\n ${github}\n ${linkedin}\n`)

  ])

  const setupHeadings = await inquirer
  .prompt([
    {
      // try checkboxes
      type: 'checkbox',
      name: 'headings',
      message: 'Please choose your readme headings: ("Title" and "Description" are mandatory.)',
      // I'd like to do 'badges' and whether or not to add html for the header, logo, centred lists and div elements and screenshots
      choices: ['User Story', 'Table of Contents', 'Features', 'Usage', 'Installation', 'Issues', 'Contributing', 'Project Links', 'License']
    }
  ])

// init the readme type
function read_me({ setup }) {
  console.info('Type of readme chosen:', setup);
  // IF user selects 'lightweight' - don't offer headings
  if (setup === 'Lightweight') {
    // skip to title/description section (function call)
    console.log('simplified readme was chosen, skipping headings now...')
    setUpReadme()
  } else {
    console.log('Professional readme selected, choose headings now...')
    setupHeadings()
  }
}

read_me(readme_type)


let htmlText =
  `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  </head>
  <body>
    <h1>${first_name}</h1>
  </body>
  </html>
  
  `

// write to file
await fs.writeFile('index.html', htmlText)

