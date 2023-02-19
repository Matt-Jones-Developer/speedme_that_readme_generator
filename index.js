// import inquirer from 'inquirer';
// import fs from 'fs';
// import util from 'util';

// CommonJS
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
// unused?
// import { dir } from 'console';

// use editor for description

// import editor from '@inquirer/editor';

// const answer = await editor({
//   message: 'Enter a description'
// });


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
      message: 'Please choose your readme headings: ("License" and "Questions" are mandatory.)',
      default: ['License', 'Questions'],
      choices: choices,
      // user must choose some headings
      validate: function (answer) {
        if (answer.length < 4) {
          return 'You must choose at least two headings.';
        }
        // if (!answer.includes('License') && !answer.includes('Questions')) {
        //   return 'You must select License and Questions!';
        if (!answer.includes('License')) {
          throw new Error('You must select License.');
        }
        if (!answer.includes('Questions')) {
          throw new Error('You must select Questions.');
        }
        return true;
      }
    },
    // this needs its own array - it's being called straight after headings which is OK but cannot access the answers?
    // only prompted if user selects
    {
      type: 'input',
      name: 'about',
      message: 'Enter a more detailed project description:',
      when: (answers) => answers.headings.includes('About the Project')
    },
    // pro version has 4 sub-headings
    {
      type: 'input',
      name: 'story',
      message: 'Enter a User Story:',
      when: (answers) => answers.headings.includes('User Story')
    },
    {
      type: 'input',
      name: 'features',
      message: 'Enter the apps main features:',
      when: (answers) => answers.headings.includes('Features')
    },
    {
      // we'll want to .Uppercase these
      type: 'input',
      name: 'languages',
      message: 'Enter the languages used to build the app:',
      when: (answers) => answers.headings.includes('Built With')
    },
    // only called if screenshots are applicable 
    // in pro this is more complex - select amount, each filename etc
    {
      type: 'input',
      name: 'product',
      message: 'Enter the full filepath for your product screenshot (start with ./):',
      when: (answers) => answers.headings.includes('The Product')
    },
    {
      type: 'input',
      name: 'started',
      message: 'Explain what the user needs to do to use the app (How-To):',
      when: (answers) => answers.headings.includes('Getting Started')
    },
    {
      type: 'input',
      name: 'prerequisites',
      message: 'Enter any other packages or frameworks the user will to install first (or N/A):',
      when: (answers) => answers.headings.includes('Prerequisites')
    },
    {
      type: 'input',
      name: 'installation',
      message: 'Please offer instructions on how to install the app, if required (or N/A):',
      when: (answers) => answers.headings.includes('Installation')
    },
    {
      type: 'input',
      name: 'usage',
      message: 'Explain some example usages of the app:',
      when: (answers) => answers.headings.includes('Usage')
    },
    {
      type: 'input',
      name: 'design',
      message: 'Provide insight into your design process.  Include UX and UI concepts:',
      when: (answers) => answers.headings.includes('UX/UI Design')
    },
    {
      type: 'input',
      name: 'roadmap',
      message: 'Provide a project roadmap or a list of future improvements:',
      when: (answers) => answers.headings.includes('Roadmap')
    },
    {
      type: 'input',
      name: 'tests',
      message: 'Explain how you can test the product?? We have not covered testing yet!',
      when: (answers) => answers.headings.includes('Tests')
    },
    // Pro version provides better formatting , with links to other users
    {
      type: 'input',
      name: 'team',
      message: 'Who else contributed to this project? Provide names and github usernames:',
      when: (answers) => answers.headings.includes('Contributing')
    },
    {
      type: 'input',
      name: 'links',
      message: 'Provide the full URL to the deployed app:',
      when: (answers) => answers.headings.includes('Project Links')
    },

    // init headings.answers
    // let proAnswers = headings.name;
    // console.log(headings)
    // access an item
    // console.log(headings.team)
  ]);

  // generate ToC within the headings function 
  // console.log('Headings entered:', headings);
  // filter a new array of chosen headings
  const chosenHeadings = choices.filter((choice) => headings.includes(choice));
  // assign them to tocSection to be rendered & call generate
  const tocSection = generateTableOfContents(chosenHeadings);
  console.log('chosenHeadings stored:', chosenHeadings);

  //define the main contents (headings/text)
  // const mainContent = await inquirer.prompt(headings.name);
  // console.log(mainContent)

  return tocSection, chosenHeadings;
};

// function that renders the ToC
const generateTableOfContents = (chosenHeadings) => {
  return chosenHeadings.map((heading) => {
    const anchor = heading.toLowerCase().replace(/ /g, '-');
    return `* [${heading}](#${anchor})`;
  }).join('\n');
};

// function that handles the license section
// in the Pro version - the 'license' text is the link
const generateLicenseSection = (license, chosenLicense) => {
  return `
    #
    ## License\n
    This project is licensed under the terms of the ${license} license.\n
    For more information, please visit this link: ${chosenLicense}
  `;
};

// generate badges at top of readme
const generateBadgesSection = (answers, chosenBadge) => {
  // const chosenBadge = licenseBadges[answers.license];
  console.log('license chosen:', answers.license);
  console.log('badge url chosen:', chosenBadge);
  return `

    <div align="center">
      \t<img src="${chosenBadge}" alt="license-badge-image">
    </div>  
    <br>
  `;
}

const generateMainContentsSection = (chosenHeadings) => {
  const mainTitles = [];
  let items = [];
  console.log('chosenHeadings at mainContent:', chosenHeadings)
  // all the selected headings and content prompts for each
  for (let i = 0; i < chosenHeadings.length; i++) {
    const title = chosenHeadings[i];
    console.log(title)
    if (title !== 'License' && title !== 'Questions') {
      // push to new array
      mainTitles.push(title)
    }
    // create a new array or split?
    items = mainTitles.map(item => {
      return `
      ## ${item}\n
      `
    })
  }
  return `
  ${items.join('')}\n
  `
}

const generateInstallation = (answers) => {
  return `
  ### A basic guide to install and setup ${answers.title}
  `
}

// issues: 'other methods' prints all links selected in one go
// github link is now text and 
// const generateQuestionsSection = (answers) => {
//   // for loop for each method chosen
//   let methods = answers.methods;
//   // console.log(typeof (methods)) //object
//   // methods.forEach(element => console.log(element)); // returns each chosen
//   // const chosenMethods = [];

//   // methods.forEach(method => {
//   //   chosenMethods.push(`'${method}' : ${method}`);
//   // });
//   // map!
//   const chosenMethods = methods.map(method => `[${method}](${answers[method]})`);

//   return `
//   ## Questions\n
//   For questions or concerns, please contact [${answers.username}](${answers.github}) via Github.\n
//   ### Other contacts:\n
//   You can also reach me via the following:\n
//   [Email](${answers.email}), [Other methods:](${chosenMethods.join(' ')})
//   `
// }

const generateQuestionsSection = (answers) => {
  // all contact methods
  let methods = answers.methods;
  const chosenMethods = methods.map(method => {
    const methodInfo = {
      name: method,
      url: answers[method.toLowerCase()]
    };
    return methodInfo;
  });

  const otherMethods = chosenMethods.filter(method => method.url && method.name);
  const otherMethodsLinks = otherMethods.map(method => `[${method.name}](${method.url})`).join(', ');

  return `
  #
  ## Questions\n
  For questions or concerns, please contact [${answers.username}](${answers.github}) via Github.
  ###  Other contacts:\n
  You can also reach me via the following:\n
  [Email](${answers.email}), ${otherMethodsLinks}
  `;
}


// grab all the inputs from the user 
const setupReadme = async (chosenHeadings = []) => {

  const licenses = [
    { name: 'Apache 2.0', value: 'Apache 2.0' },
    { name: 'GNU AGPL v3.0', value: 'GNU AGPL v3.0' },
    { name: 'MIT', value: 'MIT' }
  ];

  const licenseLinks = {
    'Apache 2.0': 'https://choosealicense.com/licenses/apache-2.0/',
    'GNU AGPL v3.0': 'https://choosealicense.com/licenses/agpl-3.0/',
    'MIT': 'https://choosealicense.com/licenses/mit/'
  };

  const licenseBadges = {
    'Apache 2.0': 'https://img.shields.io/badge/License-Apache%202.0-orange.svg',
    'GNU AGPL v3.0': 'https://img.shields.io/badge/license-GNU%20AGPL%20v3.0-red.svg',
    'MIT': 'https://img.shields.io/badge/license-MIT-brightgreen.svg'
  }

  const questions = [
    {
      type: 'input',
      name: 'title',
      message: 'What is the title of your project?',
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must provide a title.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Summarise your project here: (Include a project "tagline" first):',
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must provide a summary.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'username',
      message: 'What is your github username?',
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must provide a username.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'github',
      message: 'What is your github repo URL?',
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must provide a repo URL.';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'license',
      message: 'Please choose a license type:',
      choices: licenses,
      // press enter for default
      default: 'Apache 2.0'
    },
    {
      type: 'input',
      name: 'email',
      message: 'What is your email address?'
    },
    {
      type: 'checkbox',
      name: 'methods',
      message: 'Please select all available contact methods:',
      choices: [
        'LinkedIn', 'Twitter', 'Slack', 'Instagram'
      ]
    },
    {
      type: 'input',
      name: 'linkedin',
      message: 'Enter your LinkedIn profile URL:',
      when: (answers) => answers.methods.includes('LinkedIn')
    },
    {
      type: 'input',
      name: 'twitter',
      message: 'Enter your Twitter handle:',
      when: (answers) => answers.methods.includes('Twitter')
    },
    {
      type: 'input',
      name: 'slack',
      message: 'Enter your Slack username:',
      when: (answers) => answers.methods.includes('Slack')
    },
    {
      type: 'input',
      name: 'instagram',
      message: 'Enter your Instagram username:',
      when: (answers) => answers.methods.includes('Instagram')
    }
  ];

  const answers = await inquirer.prompt(questions);
  console.log('all the answers:', answers);
  console.log(answers.username, answers.email, answers.github) // all accessing fine?

  // define the license url
  const chosenLicense = licenseLinks[answers.license];
  console.log('user chose license: ', chosenLicense)

  // define the correct badge
  const chosenBadge = licenseBadges[answers.license];
  console.log('chosen badge to match:', chosenBadge)
  console.log('license chosen:', answers.license)
  console.log('badge url chosen:', chosenBadge)


  // const { title, description, username, github, license, email } = await inquirer.prompt([
  // const { title, description, username, github, license, email, methods } = await inquirer.prompt([
  // ]);


  // console.info('Here is a summary of the project selections:',
  //   `\n${title}.\n ${description}.\n ${username}.\n ${github}.\n ${license}.\n ${email}.\n ${methods}`);


  // setup the additional prompts (for Professional)

  // const { badge, username, email, social } = await inquirer.prompt([
  //   // {
  //   //   type: 'checkbox',
  //   //   name: 'badges',
  //   //   message: "Please select the badges you'd like to include:",
  //   //   choices: badges,
  //   // },
  //   {
  //     type: 'input',
  //     name: 'description',
  //     message: 'What is the project description?'
  //   },
  //   {
  //     type: 'input',
  //     name: 'github',
  //     message: 'What is your github repo URL?'
  //   },
  //   {
  //     type: 'list',
  //     name: 'license',
  //     message: 'Please choose a license type:',
  //     choices: licenses,
  //     // press enter for default
  //     default: 'Apache 2.0'
  //   },
  // ]);


  // send the chosenLicense url link to generateMarkdown
  // output to folder 
  const outputDir = './output';
  // return chosenLicense;

  async function generateAndWriteReadme() {
    try {
      // if using util files import change this line to:
      const readmeContent = generateMarkdown({ answers, chosenLicense, chosenBadge, chosenHeadings });
      // const readmeContent = generateReadme({ title, description, github, license, chosenHeadings });

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
}

// thanks google for the .replace(/\n/g, '\n  ') !
const generateMarkdown = ({ answers, chosenLicense, chosenBadge, chosenHeadings = [] }) => {

  // ToC and headings try catch
  let headings = '';
  let tocSection = '';
  let installation = '';
  try {
    if (chosenHeadings.length > 0) {
      tocSection = `
          ## Table of Contents\n
          ${generateTableOfContents(chosenHeadings).replace(/\n/g, '\n  ')}
        `;
      headings = `
          ${generateMainContentsSection(chosenHeadings)}
        `;

    }
    // works - until other headings come after installation heading
    // const installationIndex = chosenHeadings.indexOf('Installation');
    // console.log('instIndex:',installationIndex)
    // if (installationIndex >= 0) {
    //   installation = `
    //     ${generateInstallation(answers)}
    //   `;
    //   chosenHeadings.splice(installationIndex, 1);
    // }
    // plan b - use slice, splice, lastindexof and concat
    const installationIndex = chosenHeadings.indexOf('Installation');
    console.log('instIndex:', installationIndex)
    if (installationIndex >= 0) {
      installation = `
        ${generateInstallation(answers)}
      `;
      const before = chosenHeadings.slice(0, installationIndex);
      console.log('beforeIndex:', before)
      const after = chosenHeadings.slice(installationIndex + 1);
      console.log('afterIndex:', after)
      const lastHeadingIndex = after[0];
      console.log('lastheadingIndex:', lastHeadingIndex)
      before.splice(lastHeadingIndex - 1, 0, `\n${installation}\n`);
      chosenHeadings = before.concat(after);

    }

    // const installationIndex = chosenHeadings.indexOf('Installation');
    // console.log('instIndex:', installationIndex)
    // if (installationIndex >= 0) {
    //   installation = generateInstallation(answers);
    //   const before = chosenHeadings.slice(0, installationIndex);
    //   console.log('beforeIndex:', before)
    //   const after = chosenHeadings.slice(installationIndex + 1);
    //   console.log('afterIndex:', after)
    //   const lastHeadingIndex = after.findIndex(heading => heading.startsWith('###'));
    //   const insertIndex = installationIndex + 1 + lastHeadingIndex;
    //   chosenHeadings.splice(insertIndex, 0, installation);
    // }

    // const installationIndex = chosenHeadings.indexOf('Installation');
    // if (installationIndex >= 0) {
    //   installation = generateInstallation(answers);
    //   const before = chosenHeadings.slice(0, installationIndex);
    //   const after = chosenHeadings.slice(installationIndex);
    //   const afterIndex = after.findIndex(heading => heading.startsWith('### '));
    //   if (afterIndex >= 0) {
    //     after.splice(afterIndex, 0, `## Installation`);
    //     chosenHeadings = before.concat(after);
    //   } else {
    //     chosenHeadings = before.concat([`## Installation`], after);
    //   }
    // }

    // const installationIndex = chosenHeadings.indexOf('Installation');
    // console.log('instIndex:', installationIndex)
    // if (installationIndex >= 0) {
    //   const installation = generateInstallation(answers);
    //   chosenHeadings.splice(installationIndex, 1);
    //   const before = chosenHeadings.slice(0, installationIndex);
    //   console.log('before:', before)
    //   const after = chosenHeadings.slice(installationIndex);
    //   console.log('after:', after)
    //   const afterIndex = after.findIndex((heading) => heading.startsWith('### '));
    //   console.log('afterIndex:', after)
    //   if (afterIndex >= 0) {
    //     after.splice(afterIndex, 0, '### Installation');
    //   } else {
    //     after.push('### Installation');
    //   }
    //   chosenHeadings = [...before, ...after];
    // }

    // how to insert a function call in between 2 indexes?




  } catch (error) {
    console.error('Error generating Table of Contents section (user chose not to): ', error);
  }
  return `

      ${generateBadgesSection(answers, chosenBadge)}

      # ${answers.title}
  
      ## Project Summary\n
      ${answers.description}
      #
      ${tocSection}
      ${headings}

      ${generateLicenseSection(answers.license, chosenLicense)}

      ${generateQuestionsSection(answers)}


    `.replace(/^ +/gm, '');
};

run();

// ## ${generateMainContentsSection(headings)}