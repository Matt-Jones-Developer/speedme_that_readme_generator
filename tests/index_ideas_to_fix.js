// [TODO]: init() module script

// CommonJS
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');

// Promisify the `fs.writeFile()` function
const writeFileAsync = util.promisify(fs.writeFile);

async function run() {
  // init the readme type
  const { setup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setup',
      message: '\n📟💬 Welcome to 💥TURBO README!💥\nThe Worlds most comprehensive README generator. 👋\n\n📟💬 Please select your type of readme:',
      choices: ['Lightweight', 'Professional'],
      default: 'Professional'
    }
  ]);

  // console.info('Type of readme chosen:', setup);

  // now the conditional can operate within the top level
  if (setup === 'Lightweight') {
    // console.log('Simplified readme was chosen, skipping headings now...\n');
    await setupReadme();
  } else {
    // console.log('Professional readme selected, choose headings now...\n');
    // allow chosenHeadings to be accessed
    const chosenHeadings = await setupHeadings();
    await setupReadme(chosenHeadings);

  }
}

// [TODO] setupHeadings module

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
      message: '\n📟💬 Please choose your readme headings: (❗ "License" and "Questions" are mandatory.)',
      default: ['License', 'Questions'],
      choices: choices,
      // user must choose some headings
      validate: function (answer) {
        if (answer.length < 4) {
          return '❗ You must choose at least two headings.';
        }
        // if (!answer.includes('License') && !answer.includes('Questions')) {
        //   return 'You must select License and Questions!';
        if (!answer.includes('License')) {
          throw new Error('❗ You must select License.');
        }
        if (!answer.includes('Questions')) {
          throw new Error('❗ You must select Questions.');
        }
        return true;
      }
    }
  ]);

  // pro questions
  const proAnswers = {
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
  };

  if (headings.includes('About the Project')) {
    proAnswers.about = await inquirer.prompt([{
      type: 'input',
      name: 'about',
      message: '📟💬 Enter a detailed project description:',
      validate: (input) => input !== '' || '❗ You must provide a detailed project description.',
    }]);
  }

  if (headings.includes('User Story')) {
    proAnswers.story = await inquirer.prompt([{
      type: 'input',
      name: 'story',
      message: '📟💬 Enter a User Story (Include summary, motivation, challenges and product USPs):',
      validate: (input) => input !== '' || '❗ You must provide a detailed User Story.',
    }]);
  }
  if (headings.includes('Features')) {
    proAnswers.features = await inquirer.prompt([{
      type: 'input',
      name: 'features',
      message: '📟💬 Enter the apps main features (answers will be auto bullet-pointed):',
      validate: (input) => input !== '' || '❗ You must provide some product features.',
    }]);
  }
  if (headings.includes('Built `With')) {
    // MUST return .toUpperCase: return str[0].toUpperCase() + str.slice(1);
    // [TODO]: user then specifies a link to the 'logos' folder for them to be rendered too
    proAnswers.languages = await inquirer.prompt([{
      type: 'input',
      name: 'languages',
      message: '📟💬 Enter the languages, frameworks and packages used to build the app:',
      validate: (input) => input !== '' || '❗ You must provide the languages and frameworks used.',
    }]);
  }
  if (headings.includes('The Product')) {
    proAnswers.product = await inquirer.prompt([{
      type: 'input',
      name: 'product',
      message: '📟💬 Paste the full filepath for your product screenshot (start with "./ <filepath> "):',
      default: "./ <filepath> ",
      validate: (input) => input !== '' || '❗ You must provide a filepath to a product screenshot.',
    }]);
  }
  // in pro this is more complex - select amount, each filename etc
  if (headings.includes('Get Started')) {
    proAnswers.started = await inquirer.prompt([{
      type: 'input',
      name: 'started',
      message: '📟💬 Explain what the user needs to do to use the app (How-To):',
      validate: (input) => input !== '' || '❗ You must provide a get-started guide.',
    }]);
  }
  if (headings.includes('Prerequisites')) {
    proAnswers.prerequisites = await inquirer.prompt([{
      type: 'input',
      name: 'prerequisites',
      message: '📟💬 Enter any other packages or frameworks the user will need to install first (or N/A):',
      validate: (input) => input !== '' || '❗ You must provide prerequisites or N/A.',
    }]);
  }
  if (headings.includes('Installation')) {
    proAnswers.installation = await inquirer.prompt([{
      type: 'input',
      name: 'installation',
      message: '📟💬 Please offer instructions on how to install the app, if required (or N/A):',
      validate: (input) => input !== '' || '❗ You must provide instructions or N/A.',
    }]);
  }
  if (headings.includes('Usage')) {
    proAnswers.usage = await inquirer.prompt([{
      type: 'input',
      name: 'usage',
      message: '📟💬 Explain some example usages of the app:',
      validate: (input) => input !== '' || '❗ You must provide some usage examples or N/A.',
    }]);
  }
  if (headings.includes('UX/UI Design')) {
    proAnswers.design = await inquirer.prompt([{
      type: 'input',
      name: 'design',
      message: '📟💬 Provide insight into your design process.  Include UX and UI concepts:',
      validate: (input) => input !== '' || '❗ You must provide some design notes ([TODO]: add screenshots path).',
    }]);
  }
  if (headings.includes('Roadmap')) {
    proAnswers.roadmap = await inquirer.prompt([{
      type: 'input',
      name: 'roadmap',
      message: '📟💬 Provide a project roadmap or a list of future improvements:',
      validate: (input) => input !== '' || '❗ You must provide a roadmap or future features.',
    }]);
  }
  if (headings.includes('Tests')) {
    proAnswers.tests = await inquirer.prompt([{
      type: 'input',
      name: 'tests',
      message: '📟💬 Explain how you can test the product?? We have not covered testing yet!',
      validate: (input) => input !== '' || '❗ You must provide test details.',
    }]);
  }
  // Pro version provides better formatting , with links to other users
  if (headings.includes('Contributing')) {
    proAnswers.team = await inquirer.prompt([{
      type: 'input',
      name: 'team',
      message: '📟💬 Who else contributed to this project? Provide names and github userID or links:',
      validate: (input) => input !== '' || '❗ You must provide contributing details.',
    }]);
  }
  // the already requested 'repo link' will be auto pasted above this 
  if (headings.includes('Project Links')) {
    proAnswers.links = await inquirer.prompt([{
      type: 'input',
      name: 'links',
      message: '📟💬 Provide the full URL to the deployed app:',
      validate: (input) => input !== '' || '❗ You must provide the projects deployment link.',
    }]);
  }

  // init all ToC, headings and proAnswers

  const finalAnswers = {
    ...proAnswers,
    headings: headings
  };

  console.log('all finalAnswers:', finalAnswers)
  // testing object item access
  // console.log('access a proAnswers item (links)?:', proAnswers.links) // OK!
  // console.log('access a finalAnswers item (links)?:', finalAnswers.story) // OK!


  // generate ToC within the headings function 
  // filter a new array of chosen headings
  const chosenHeadings = choices.filter((choice) => headings.includes(choice));
  // assign them to tocSection to be rendered & call generate
  const tocSection = generateTableOfContents(chosenHeadings);
  console.log("\n📟💬 You're chosen headings were stored successfully! 💥:", chosenHeadings);

  return tocSection, chosenHeadings; // finalAnswers!
};

// [TODO]: generate module script:

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

// generate badges at top of readme - 'answers' will be added here to add a choice of additional badges
const generateBadgesSection = (answers, chosenBadge) => {
  // console.log('license chosen:', answers.license);
  // console.log('badge url chosen:', chosenBadge);
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

// ideally, merge this with the mainContent function (which should be both headings with correct content anyway!)
// const generateProAnswersSection = (finalAnswers) => {
//   let section = '\n## Final Answers\n\n';
//   Object.entries(finalAnswers).forEach(([heading, answer]) => {
//     section += `### ${heading}\n\n${answer}\n\n`;
//   });
//   return section;
// };


// const generateInstallation = (answers) => {
//   return `
//   ### A basic guide to install and setup ${answers.title}
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
  const otherMethodsLinks = otherMethods.map(method => `[${method.name}](${method.url})`).join(' · ');

  return `
  #
  ## Questions\n
  For questions or concerns, please contact [${answers.username}](${answers.github}) via Github :octocat:.
  ###  Other contacts:\n
  You can also reach me via the following: 👻💬\n
  📪 [Email](${answers.email}) · ${otherMethodsLinks} 
  `;
}

// [TODO] setupReadme module (baseQuestions. licensing etc)

// grab all the inputs from the user 
const setupReadme = async (chosenHeadings = []) => {

  // switch for polite update
  // let notify = false;
  // console.log('notify:', notify)

  // define license and badges arrays and objects
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


  const baseQuestions = [
    {
      type: 'input',
      name: 'title',
      message: '📟💬 What is the title of your project?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a title.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'description',
      message: '📟💬 Summarise your project here: (Include a project "tagline" first):',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a summary.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'username',
      message: '📟💬 What is your github username?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a username.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'github',
      message: '📟💬 What is your github repo URL?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a repo URL.';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'license',
      message: '📟💬 Please choose a license type:',
      choices: licenses,
      // press enter for default
      default: 'Apache 2.0'
    },
    {
      type: 'input',
      name: 'email',
      message: '📟💬 What is your email address?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide an email.';
        }
        return true;
      }
    },
    {
      type: 'checkbox',
      name: 'methods',
      message: '📟💬 Please select all available contact methods:',
      choices: [
        'LinkedIn', 'Twitter', 'Slack', 'Instagram'
      ]
    },
    // once contact methods selected, prompt:
    {
      type: 'input',
      name: 'linkedin',
      message: '📟💬 Enter your LinkedIn profile URL:',
      when: (answers) => answers.methods.includes('LinkedIn')
    },
    {
      type: 'input',
      name: 'twitter',
      message: '📟💬 Enter your Twitter handle:',
      when: (answers) => answers.methods.includes('Twitter')
    },
    {
      type: 'input',
      name: 'slack',
      message: '📟💬 Enter your Slack username:',
      when: (answers) => answers.methods.includes('Slack')
    },
    {
      type: 'input',
      name: 'instagram',
      message: '📟💬 Enter your Instagram username:',
      when: (answers) => answers.methods.includes('Instagram')
    },

    // notify = true,
    // console.log('notify:', notify)
  ];

  // if (!notify) {
  //   // notify SUCCESS
  //   console.log('\n📟💬 Polite Notice:\n --> Please answer the following base questions:\n')
  // } else {
  //   console.log('📟💬 Polite Notice:\nGreat! All your answers have been stored. ✅ \n')
  // }

  // init baseAnswers, chosenLicense and chosenBadge

  const answers = await inquirer.prompt(baseQuestions);
  // const methodsString = answers.methods.map(method => `\n\t${method}:`).join('');

  // console.log('\n📟💬 Here is a summary of your answers:\n\n', JSON.stringify(answers, null, 2)

  //   // Remove quotes and punctuation
  //   .replace(/[{"},\[\]]/g, '')
  //   // Capitalise headings
  //   .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase())
  //   // Replace array brackets with "Methods:" heading and individual key-value pairs
  //   .replace(/Methods:\s\[(.*)\]/g, `Contact Options:${methodsString}`)
  //   // Convert Email to lowercase
  //   .replace(/(^|[^\w])(email)([^\w]|$)/g, '$1email$3') // lowercase 'email'
  // );

  // // fix capitalise issues: TODO
  // const answers = await inquirer.prompt(questions);
  // const formattedAnswers = JSON.stringify(answers, (key, value) => {
  //   // If the key is "email" and the value matches an email ending with ".io" or ".com",
  //   // return the value in lowercase. Otherwise, capitalize the first letter of the value.
  //   if (key === "email" && value.match(/@[a-z]+\.(io|com)$/i)) {
  //     return value.toLowerCase();
  //   } else {
  //     return value.charAt(0).toUpperCase() + value.slice(1);
  //   }
  // }, 2);
  // console.log(formattedAnswers);



  // console.log(answers.username, answers.email, answers.github) // all accessing fine

  // define the license url
  const chosenLicense = licenseLinks[answers.license];
  // console.log('user chose license url: ', chosenLicense)

  // define the correct badge
  const chosenBadge = licenseBadges[answers.license];
  // console.log('chosen badge url to match:', chosenBadge)
  console.log('\n📟💬 You chose License:', answers.license)
  // console.log('badge url chosen:', chosenBadge)


  // [TODO] output module (the file writing module)

  // output to folder 
  const outputDir = './output';

  async function generateAndWriteReadme() {

    // if (notify) {
    //   // notify SUCCESS
    //   console.log('📟💬 Polite Notice:\nGreat! All your answers have been stored! ✅ \n')
    // }
    // - must add finalAnswers/proAnswers
    try {
      // if using util files import change this line to:
      const readmeContent = generateMarkdown({ answers, chosenLicense, chosenBadge, chosenHeadings}); // cannot add finalAnswers here??
      // const readmeContent = generateReadme({ title, description, github, license, chosenHeadings });

      // Create the 'output' directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      // Write the README.md file to the 'output' directory
      await writeFileAsync(`${outputDir}/README.md`, readmeContent);

      // confirmation 
      console.log('\n💥WOOHOO!💥');
      console.log('📟💬 Your README.md file was created! 🎉🎉\n');
      console.log('📟💬 You can access it via the "output" folder within this repo.\nIf you enjoyed using this program, please let me know!\n');
      console.log('📟💬 This program will now terminate: GOOD DAY!\n')
    } catch (error) {
      console.error('❗ Error generating or writing README.md file:', error);
    }
  }
  generateAndWriteReadme();
}

// [TODO] The generateMarkdown module - must add finalAnswers/proAnswers

// thanks google for the .replace(/\n/g, '\n  ') !
const generateMarkdown = ({ answers, chosenLicense, chosenBadge, chosenHeadings = [] }) => {

  // ToC and headings try catch
  let headings = '';
  let tocSection = '';
  // let installation = '';
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
    // const installationIndex = chosenHeadings.indexOf('Installation');
    // // console.log('instIndex:', installationIndex)
    // if (installationIndex >= 0) {
    //   installation = `
    //     ${generateInstallation(answers)}
    //   `;
    //   const before = chosenHeadings.slice(0, installationIndex);
    //   // console.log('beforeIndex:', before)
    //   const after = chosenHeadings.slice(installationIndex + 1);
    //   // console.log('afterIndex:', after)
    //   const lastHeadingIndex = after[0];
    //   // console.log('lastheadingIndex:', lastHeadingIndex)
    //   before.splice(lastHeadingIndex - 1, 0, `\n${installation}\n`);
    //   chosenHeadings = before.concat(after);

    // }

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
    console.error('❗ Error generating Table of Contents section (user chose not to): ', error);
  }

  // let proAnswersSection = '';
  // if (Object.keys(finalAnswers).length > 0) {
  //   proAnswersSection = generateProAnswersSection(finalAnswers);
  // }

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
