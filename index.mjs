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
    await setupReadme();
  } else {
    console.log('Professional readme selected, choose headings now...');
    // allow chosenHeadings to be accessed
    const chosenHeadings = await setupHeadings();
    await setupReadme(chosenHeadings);
  
  }

  console.log('Successfully wrote to README.md');
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

  console.log('Headings entered:', headings);
  // filter a new array of chosen headings
  const chosenHeadings = choices.filter((choice) => headings.includes(choice));
  // assign them to tocSection to be rendered & generate
  const tocSection = generateTableOfContents(chosenHeadings);

  console.log('chosenHeadings stored:', chosenHeadings);

  return tocSection, chosenHeadings;
};

const generateTableOfContents = (chosenHeadings) => {
  return chosenHeadings.map((heading) => {
    const anchor = heading.toLowerCase().replace(/ /g, '-');
    return `* [${heading}](#${anchor})`;
  }).join('\n');
};

// if 0 chosen, allow the arg
const setupReadme = async (chosenHeadings = []) => {
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

  // const headings = await setupHeadings(); - nope
  const readmeContent = generateReadme({ title, description, github, license, chosenHeadings });
  // Write the README.md file to disk
  await writeFileAsync('README.md', readmeContent);
  console.log('README.md file created!'); // this doesn't log anymore??
}
// thanks google for the .replace(/\n/g, '\n  ') !
const generateReadme = ({ title, description, github, license, chosenHeadings =[]}) => {
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
      This project is licensed under the terms of the ${license} license.

      ## Questions\n
      For questions or concerns, please contact [${github}](${github}).

    `.replace(/^ +/gm, '');
};

run();
