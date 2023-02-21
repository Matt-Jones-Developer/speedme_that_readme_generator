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
      default: 'Lightweight'
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
    // await setupReadme(chosenHeadings);
    await setupReadme(chosenHeadings);
  }
}

// [TODO] setupHeadings module PROFESSIONAL ONLY WIP

const setupHeadings = async () => {
  // see index_pro_wip for code
  console.log("👻💬 Coming soon folks!")
  console.log("Features:\n- Advanced headings selection\n- Merged headings & appended contents\n- html styling\n- screenshots and header/logo\n - more badges!\n - User Story with subheadings!\n - And mooooore!")
  return;
}

function capitalise(str) {
  if(typeof str === 'string') {
    return str[0].toUpperCase() + str.slice(1);
  }
  return str;
}

// a function that grabs the users pathname to fetch files from
function getFilePath(answers) {
  const path = require('path');
  let filepath = answers.filepath; // '/Users/glitchy81/bootcamp/readme_builder/assets/images'
  console.log('filepath:', filepath)
  // grab the filename
  let file = 'screenshot.png';
  // join the filepath and filename 
  // let fullPath = `'.${filepath}/${file}'`
  let fullPath = `${filepath}/${file}`
  console.log('fullpath:', fullPath)
  // return `Screenshot filepath:, './'+${filepath}+${file}`
  // return `![product screenshot](${fullPath})` // 
  return `![Product Screenshot](${fullPath})`;
}

// [TODO]: generate module script:

const generateToC = (headingsMVP) => {
  console.log('are headingsMVP making toc:', headingsMVP);
  return headingsMVP.map((heading) => {
    const anchor = heading.toLowerCase().replace(/ /g, '-');
    return `* [${heading}](#${anchor})`;
  }).join('\n');
};

// function that handles the license section
const generateLicenseSection = (license, chosenLicense) => {
  return `
    #
    ## License\n
    This project is licensed under the terms of the ${license} license.\n
    For more information, please visit this link: ${chosenLicense}
  `;
};

// generate badge at top of readme  - answers must be included here for badge to render 
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

const generateOpenSourceSection = (answers) => {
  // basic contribution notice (included)
  // if opensource (add covenant info)
    return`
    ## ${answers.title} is an Open Source Project:
    [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)\n
    ### Code of Conduct:
    Learn more about open source code of conduct:
    [Contributor Covenant](https://www.contributor-covenant.org/)\n
    Read the full code of conduct here:
    [English (HTML version)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)\n
    ### Attribution
    Contributor Covenant is included in this open source project.  Read the [license.](https://github.com/EthicalSource/contributor_covenant/blob/release/LICENSE.md)
    `
}

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
  For questions or concerns, please contact [${answers.username}](${answers.github}) via Github.
  ###  Other contacts:\n
  You can also reach me via the following: 👻💬\n
  📪 [Email](${answers.email}) · ${otherMethodsLinks} 
  `;
}

// [TODO] setupReadme module (baseQuestions. licensing, MVP etc)

// grab all the inputs from the user 
const setupReadme = async () => {

  // MVP headings
  const headingsMVP = [
    'Description',
    'Installation',
    'Usage',
    'Tests',
    'Contributing',
    'License',
    'Questions'
  ];
  
  console.log()
  console.log('\n👻💬 MVP Headings are: ', headingsMVP)

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
      name: 'installation',
      message: '📟💬 Please offer installation instructions, including any required dependencies:',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide instructions.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'usage',
      message: '📟💬 Provide some features and examples of usage of the app:',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide usage notes.';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'screenshot',
      message: '📟💬 Do you want to include a screenshot.png? It must be placed inside assets/images folder.',
      choices: ['yes', 'no'],
      default: 'yes'
    },
    // {
    //   type: 'input',
    //   name: 'filepath',
    //   message: '📟💬 Copy & paste the full pathname to your images folder "<fullpathname>" (Add a screenshot.png within assets/images folder):',
    //   when: (answers) => answers.screenshot.includes('yes'),
    //   validate: function (value) {
    //     // Check if the input is a valid filepath
    //     const valid = value.startsWith('/Users');
    //     return valid || 'Please enter a valid filepath starting with "Users/"';
    //     // 
    //   },
    // },
    {
      type: 'input',
      name: 'tests',
      message: '📟💬 Explain what testing has been done and how you can run tests on the app:',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide usage notes.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'contributing',
      message: '📟💬 Explain how others can contribute to this project.',
      // when: (answers) => answers.opensource.includes('yes'),
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a note on contributing.';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'opensource',
      message: '📟💬 Is the project Open Source? (The open source Contributor Convent guides and license will be added automatically)',
      choices: ['yes', 'no'],
      default: 'no'
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
      when: (answers) => answers.methods.includes('LinkedIn'),
      validate: function (value) {
        // Check if the input is a valid LinkedIn URL
        const valid = value.startsWith('https://www.linkedin.com/in/');
        return valid || 'Please enter a valid LinkedIn profile URL starting with "https://www.linkedin.com/in/".';
      },
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

  ];

  // init baseAnswers, chosenLicense and chosenBadge

  const answers = await inquirer.prompt(baseQuestions);
  // console.log(answers.username, answers.email, answers.github) // all accessing fine

  // define the license url
  const chosenLicense = licenseLinks[answers.license];
  // console.log('user chose license url: ', chosenLicense)
  // define the correct badge
  const chosenBadge = licenseBadges[answers.license];
  // console.log('chosen badge url to match:', chosenBadge)

  console.log('\n📟💬 You chose License:', answers.license)

  // Lightweight readme done - time to write it
  generateAndWriteReadme(headingsMVP, answers, chosenLicense, chosenBadge);

}

// [TODO] output module (the file writing module)

async function generateAndWriteReadme(headingsMVP, answers, chosenLicense, chosenBadge) {

  let notify = true;

  if (notify) {
    // notify SUCCESS
    console.log('📟💬 Great! All your answers have been stored! ✅ generating readme file...\n')
  }

  // call markdown to do its thing first
  const readmeContent = generateMarkdown({ headingsMVP, answers, chosenLicense, chosenBadge }); // chosenHeadings, finalAnswers

  // output to folder 
  const outputDir = './output';

  // catch write errors
  try {

    // Create output directory -if doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Write README.md file to output directory
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

// [TODO] The generateMarkdown module - must add finalAnswers/proAnswers

const generateMarkdown = ({ headingsMVP, answers, chosenLicense, chosenBadge }) => { // chosenHeadings = [], finalAnswers = {} 
  // console.log('opensource?: ',answers.opensource)
  // for MVP
  let tocSection = generateToC(headingsMVP);
  let openSource = '';
  // open source section
  if (answers.opensource === 'yes') {
    openSource = `
    ${ generateOpenSourceSection(answers) };
    `
  }
  // usageScreenshot = '';
  // if (answers.screenshot === 'yes') {
  //   usageScreenshot = `
  //   // ${ getFilePath(answers) }`;
  //   // console.log(answers.screenshot, usageScreenshot)
  // }

  screenshot = '';
  if (answers.screenshot === 'yes') {
    screenshot = `
    ![Product Screenshot](../assets/images/screenshot.png)`;
    // console.log(answers.screenshot, usageScreenshot)
  }

  // if file path contains filename ?

  return `
    ${generateBadgesSection(answers, chosenBadge)}

    # ${answers.title.split(' ').map(capitalise).join(' ')}

    ## Project Summary\n
    ${capitalise(answers.description)}\n
    #

    ## Table of Contents\n
    ${tocSection.replace(/\n/g, '\n  ')}
    #

    ## Installation\n
    ${capitalise(answers.installation)}\n

    ## Usage\n
    ${capitalise(answers.usage)}\n
    ${screenshot}
    
    ## Tests\n
    ${capitalise(answers.tests)}\n

    ## Contributing\n
    ${capitalise(answers.contributing)}\n
    
    ${openSource}

    ${generateLicenseSection(answers.license, chosenLicense)}

    ${generateQuestionsSection(answers)}
    
  `.replace(/^ +/gm, '');
};

run();
