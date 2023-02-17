// I want to organise my code for better maintainability - using a single async

import inquirer from 'inquirer';
import fs from 'fs/promises';

// no hoisting allowed - all functions go here, before the async!

// but I want to keep my code more organised than this.  
// Why not build both the main functions (setupReadme and setUpHeadings) into top level as separate async ?
// Which can then be called separately based on the user choice? (simple, professional) OK!

async function generateReadme() {
  const readme_type = await inquirer.prompt([
    {
      type: 'list',
      name: 'setup',
      message: 'Please select your type of readme:',
      // offer a list option
      choices: ['Lightweight', 'Professional'],
      // press enter for default
      default: 'Professional'
    }
  ]);
  console.info('Type of readme chosen:', readme_type.setup);

  // conditional check: which type are we generating?
  if (readme_type.setup === 'Lightweight') {
    // if 'Lightweight' is selected, go directly to the title/description prompts
    const answers = await setUpReadme();
    await writeFileAsync('README.md', generateReadme(answers));
    console.log('Successfully wrote to README.md');
  } else {
    // if 'Professional' is selected, first prompt for headings, then prompt for title/description
    const headings = await setupHeadings();
    const answers = await setUpReadme();
    await writeFileAsync('README.md', generateReadme({ ...headings, ...answers }));
    console.log('Successfully wrote to README.md');
  }

  // // setup {}
  // // init the readme type
  // function read_me({ setup }) {
  //   console.info('Type of readme chosen:', setup);
  //   // IF user selects 'lightweight' - don't offer headings
  //   if (setup === 'Lightweight') {
  //     // skip to title/description section (function call)
  //     console.log('simplified readme was chosen, skipping headings now...')
  //     setUpReadme()
  //   } else {
  //     console.log('Professional readme selected, choose headings now...')
  //     setupHeadings()
  //   }
  // }

  // read_me(readme_type) // cannot access due to initialization errors (too soon!)

  // setTableOfContents 
  const setupHeadings = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'headings',
      message: 'Please choose your readme headings: ("Title" and "Description" are mandatory.)',
      // Add 'badges'  html for the header, logo, centred lists and div elements and all screenshots - a separate query
      choices: [
        'User Story', 'Table of Contents', 'Features', 'Usage', 'Installation', 'Issues', 'Contributing', 'Project Links', 'License'
      ]
    }
  ])

  const setUpReadme = await inquirer.prompt([
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
    }
  ]);

  console.info('Here is a summary of the project:',
    `\n${setUpReadme.title}.\n ${setUpReadme.description}.\n ${setUpReadme.github}\n ${setUpReadme.linkedin}\n`);

  // functions for every section here!
  function generateSection1() {

  }

  function generateSection2() {

  }

  function generateSection3() {

  }

  // Call the functions
  const section1 = generateSection1();
  const section2 = generateSection2();
  const section3 = generateSection3();

  // Combine the sections into the full README.md file
  const readme = `# ${setUpReadme.title}\n\n${setUpReadme.description}\n\n${section1}\n\n${section2}\n\n${section3}`;

  // Write the README.md file to disk
  await fs.writeFile('README.md', readme);

  console.log('README.md file created!');

}

generateReadme();
