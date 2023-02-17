import inquirer from 'inquirer';
import fs from 'fs';
import util from 'util';
// unused?
// import { dir } from 'console';

// use editor for description

// import editor from '@inquirer/editor';

// const answer = await editor({
//   message: 'Enter a description'
// });

// if breaking this down to util modules - import files like so:
// import { generateMarkdown } from './utils/generateMarkdown.js';
// import generateMarkdown from './utils/generateMarkdown.js';

// import pkg from './utils/generateMarkdown.js';
// const { generateMarkdown } = pkg;

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
    await setupReadme();
  } else {
    console.log('Professional readme selected, choose headings now...');
    // allow chosenHeadings to be accessed
    const chosenHeadings = await setupHeadings();
    await setupReadme(chosenHeadings);

  }
}

const setupHeadings = async () => {
  const choices = [
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
  ];

  const { headings } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'headings',
      message: 'Please choose your readme headings: ("Title" and "Description" are mandatory.)',
      choices: choices,
      // user must choose some headings
      validate: function (answer) {
        if (answer.length < 2) {
          return 'You must choose at least two headings.';
        }
        return true;
      }
    }
  ]);

  // generate ToC within the headings function 
  console.log('Headings entered:', headings);
  // filter a new array of chosen headings
  const chosenHeadings = choices.filter((choice) => headings.includes(choice));
  // assign them to tocSection to be rendered & call generate
  const tocSection = generateTableOfContents(chosenHeadings);

  console.log('chosenHeadings stored:', chosenHeadings);

  return tocSection, chosenHeadings;
};

// function that renders the ToC
const generateTableOfContents = (chosenHeadings) => {
  return chosenHeadings.map((heading) => {
    const anchor = heading.toLowerCase().replace(/ /g, '-');
    return `* [${heading}](#${anchor})`;
  }).join('\n');
};

// function that handles the license and badge
const generateLicenseSection = (license, chosenLicense) => {

  return `
    This project is licensed under the terms of the ${license} license.
    For more information, please visit this link: ${chosenLicense}.
  `;
};


// setup license and badges
const setupLicense = async () => {

  const licenses = [
    { name: 'Apache 2.0', value: 'Apache 2.0' },
    { name: 'GNU AGPL v3.0', value: 'GNU AGPL v3.0' },
    { name: 'MIT', value: 'MIT' }
  ];

  const licenseLinks = {
    'Apache 2.0': 'https://choosealicense.com/licenses/apache-2.0/',
    'GNU AGPL v3.0': 'https://choosealicense.com/licenses/agpl-3.0/',
    'MIT': 'https://choosealicense.com/licenses/mit/',
  };

  const { license } = await inquirer.prompt([
    {
      type: 'list',
      name: 'license',
      message: 'Please choose a license type:',
      choices: licenses,
      // press enter for default
      default: 'Apache 2.0'
    },
  ]);

  // define the license url
  // const chosenLicense = license;
  // const licenseLink = licenseLinks[license];
  const chosenLicense = licenseLinks[license];
  console.log('user chose license: ', chosenLicense)

  // Generate the license section for the README
  // const licenseSection = generateLicenseSection(chosenLicense, licenseLink);

  return {
    licenses,
    licenseLinks,
    chosenLicense
  };
}

// grab all the inputs from the user 
const setupReadme = async (chosenHeadings = []) => {

  const { title, description, github } = await inquirer.prompt([
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
    }
  ]);

  console.info('Here is a summary of the project selections:',
    `\n${title}.\n ${description}.\n ${github}\n`);

  // call license setup
  setupLicense()



  // generate and write to file
  const generateAndWriteReadme = async ({ title, description, github, license, chosenLicense, chosenHeadings }) => {
    try {
      // if using util files import change this line to:
      // const { title, description, github, license } = await inquirer.prompt(questions); // shorthand for above if you put all args into same section!
      // const chosenLicense = licenseLinks[license];
      const readmeContent = generateMarkdown({ title, description, github, license, chosenLicense, chosenHeadings });
      // output to folder 
      const outputDir = './output';
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

  generateAndWriteReadme({ title, description, github });
}

// thanks google for the .replace(/\n/g, '\n  ') !
const generateMarkdown = ({ title, description, github, license, chosenLicense, chosenHeadings = [] }) => {
  let tocSection = '';
  try {
    if (chosenHeadings.length > 0) {
      tocSection = `
          ## Table of Contents\n
          ${generateTableOfContents(chosenHeadings).replace(/\n/g, '\n  ')}
        `;
    }
  } catch (error) {
    console.error('Error generating Table of Contents section (user chose not to): ', error);
  }

  // ${tocSection.replace('\t')} // this will not tab anything!
  return `
      # ${title}
  
      ## Description\n
      ${description}

      ${tocSection}

      ## License\n
      ${generateLicenseSection(license, chosenLicense)}

      ## Questions\n
      For questions or concerns, please contact [${github}](${github}).

    `.replace(/^ +/gm, '');
};

run();
