import inquirer from 'inquirer';
import fs from 'fs/promises';
// avoid readme not defined 
import util from 'util';

// Promisify the `fs.writeFile()` function
const writeFileAsync = util.promisify(fs.writeFile);

async function run() {
  // init the readme type
  const { setup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setup',
      message: 'Please select your type of readme:',
      choices: ['Lightweight', 'Professional'],
      default: 'Professional'
    }
  ]);

  console.info('Type of readme chosen:', setup);

  // now the conditional can operate within the top level
  if (setup === 'Lightweight') {
    console.log('Simplified readme was chosen, skipping headings now...');
    await setUpReadme();
  } else {
    console.log('Professional readme selected, choose headings now...');
    await setupHeadings();
    await setUpReadme();
  }

  console.log('Successfully wrote to README.md');
}

const setupHeadings = async () => {
  const { headings } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'headings',
      message: 'Please choose your readme headings: ("Title" and "Description" are mandatory.)',
      choices:
        [
          'About the Project',
          'User Story',
          'Features',
          'Built With',
          'The Product',
          'Getting Started',
          'Prerequisites',
          'Installation',
          'Usage',
          'UX/UI Design',
          'Roadmap',
          'Tests',
          'Contributing',
          'Project Links',
          'License',
          'Questions'
        ]
    }
  ]);
  console.log('Headings entered:', headings);
  return headings;
}

// generate ToC
// function that adds all of the headings as the ToC 
function generateTableOfContents(headings) {
  return `
  <!-- TABLE OF CONTENTS -->
  <details>
    <summary>Table of Contents</summary>
    <ol>
      <li>
        <a href="#about-the-project">${headings[0]}</a>
        <ul>
          <li><a href="#user-story">${headings[1]}</a></li>
        </ul>
        <ul>
        <li><a href="#features">${headings[2]}</a></li>
      </ul>
        <ul>
          <li><a href="#built-with">${headings[3]}</a></li>
        </ul>
        <ul>
          <li><a href="#the-product">${headings[4]}</a></li>
        </ul>
      </li>
      <li>
        <a href="#getting-started">${headings[5]}</a>
        <ul>
          <li><a href="#prerequisites">${headings[6]}</a></li>
          <li><a href="#installation">${headings[7]}</a></li>
        </ul>
      </li>
      <li><a href="#usage">${headings[8]}</a></li>
      <li><a href="#ux-ui-design">${headings[9]}</a></li>
      <li><a href="#roadmap">${headings[10]}</a></li>
      <li><a href="#tests">${headings[11]}</a></li>
      <li><a href="#contributing">${headings[12]}</a></li>
      <li><a href="#project-links">${headings[13]}</a></li>
      <li><a href="#license">${headings[14]}</a></li>
      <li><a href="#questions">${headings[15]}</a></li>
    </ol>
  </details>
  `;
}

const setUpReadme = async () => {
  const { title, description, github, license } = await inquirer.prompt([
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
      type: 'list',
      name: 'license',
      message: 'Please choose a license type:',
      choices: ['Apache 2.0', 'GNU v3.0', 'MIT'],
      // press enter for default
      default: 'Apache 2.0'
    },
  ]);

  console.info('Here is a summary of the project selections:',
    `\n${title}.\n ${description}.\n ${github}\n ${license}\n`);

  const headings = await setupHeadings();
  const readmeContent = generateReadme({ title, description, github, license, headings });
  // Write the README.md file to disk
  await writeFileAsync('README.md', readmeContent);
  console.log('README.md file created!');
}

const generateReadme = ({ title, description, github, license, headings }) => {
  

  const tocSection = generateTableOfContents(headings = []);


  // let tocSection = '';
  try {
    if (headings.length > 0) {
      tocSection = `
          ## Table of Contents
          ${generateTableOfContents(headings)}
        `;
    }
  } catch (error) {
    console.error('Error generating Table of Contents section (user chose not to): ', error);
  }

  return `
      # ${title}
  
      ## Description
      ${description}

      ${tocSection}

      ## License
      This project is licensed under the terms of the ${license} license

      ## Questions
      For questions or concerns, please contact 
      [${github}](${github}).

    `;

}

run();

