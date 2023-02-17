// including generateTableOfContents function to access the chosen headings (selected by user)
// generateTOC would have html <details><summary><a href=""> etc 

const generateReadme = (answers) =>
  `
  # ${answers.title}

  ## Description
  ${answers.description}

  ## Table of Contents
  ${generateTableOfContents(answers.headings)}

  ## Overview
  ${generateOverviewSection()}

  ## Built With
  ${generateLanguageLogosSection()}

  ## User Story
  ${generateUserStorySection()}

  ## Installation
  ${generateInstallationSection()}

  ## Usage
  ${generateUsageSection()}

  ## Contributing
  ${generateContributingSection()}

  ## License
  ${generateLicenseSection()}

  ## Tests
  ${generateTestsSection()}

  ## Questions
  ${generateQuestionsSection(answers.github, answers.linkedin)}
  `;


// adding all the inputs into an array and then using the array as an arg instead of lots of single args?

// use inquirer to prompt the user for input
const answers = await inquirer.prompt(prompts);

// collect the answers into an object
const readmeArgs = {
  title: answers.title,
  description: answers.description,
  github: answers.github,
  linkedin: answers.linkedin,
};

// generate the README content using the object
const readmeContent = generateReadme(readmeArgs);


// try catch to 'permit' no headings (lightweight chosen)

const generateReadmeNoHeadings = (answers) => {
  let tocSection = '';
  try {
    if (answers.headings.length > 0) {
      tocSection = `
        ## Table of Contents
        ${generateTableOfContents(answers.headings)}
      `;
    }
  } catch (error) {
    console.error('Error generating Table of Contents section: ', error);
  }

  return `
    # ${answers.title}

    ## Description
    ${answers.description}

    ${tocSection}
  `;
};

// // creating a new folder to 'output' the readme into?
// const readmeFixedContent = generateReadme({ title, description, github, license, chosenHeadings });
// // Write the README.md file to disk
// await writeFileAsync('README.md', readmeContent, (err) =>
//   err ? console.error(err) : console.log('success!') // this wont log either?
// );
// console.log('README.md file created!'); // this doesn't log anymore??

// // created a new dir to store the output - not working!

// // !! this is for a non async method version - we are using writeFileSync from util 
// // we don't need a callback for writeFileSync
// let dir = './output';
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir, { recursive: true });
// }


// async method - use try and except!

import inquirer from 'inquirer';
// this may be deleted once solved below!
// import fs from 'fs/promises';
// import entire fs module ! [solved]
import fs from 'fs';
// avoid readme not defined 
import util from 'util';

const outputDir = './output';

async function generateAndWriteReadme() {
  try {
    const readmeContent = generateReadme({ title, description, github, license, chosenHeadings });

    // Create the 'output' directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Write the README.md file to the 'output' directory
    await writeFileAsync(`${outputDir}/README.md`, readmeContent);

    console.log('README.md file created!');
  } catch (error) {
    console.error('Error generating or writing README.md file:', error);
  }
}

generateAndWriteReadme();


// FUTURE UPDATE: Customised headings!

const setupHeadings = async () => {
  const { hasHeadings } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'hasHeadings',
      message: 'Do you want to use headings?',
      default: true
    }
  ]);

  if (!hasHeadings) {
    return []; // Return an empty array if user chooses not to use headings
  }

  const { numHeadings } = await inquirer.prompt([
    {
      type: 'number',
      name: 'numHeadings',
      message: 'How many headings do you want to create?',
      default: 1
    }
  ]);

  const headings = [];

  for (let i = 0; i < numHeadings; i++) {
    const { heading } = await inquirer.prompt([
      {
        type: 'input',
        name: 'heading',
        message: `Enter heading ${i + 1}:`
      }
    ]);
    headings.push(heading);
  }

  console.log('Here are the chosen headings:', headings);

  return headings;
};


// then inside run
headings = await setupHeadings();
await setUpReadme(headings);

// allow setupHeadings to access headings
const generateReadmeWHeadings = ({ title, description, github, license, headings = [] }) => {
  // generate
}