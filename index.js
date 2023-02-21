// [TODO]: init() module script
// CommonJS
const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Promisify the `fs.writeFile()` function
const writeFileAsync = util.promisify(fs.writeFile);

async function run() {
  // init the readme type
  const { setup } = await inquirer.prompt([
    {
      type: 'list',
      name: 'setup',
      message: '\n📟💬 Welcome to 🔥 SPEEDME! 🔥 The Ultimate README generator. 👋\n\n📟💬 Please select your type of readme:',
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
  console.log("Features:\n- Advanced headings selection\n- Merged headings & appended contents\n- Mo HTML styling\n- Multiple screenshots and header logo\n- More (resized) badges\n- User Story adv. mode\n- Modularised scripts!\n- And mooooore!")
  return;
}

function capitalise(str) {
  if (typeof str === 'string') {
    return str[0].toUpperCase() + str.slice(1);
  }
  return str;
}

// a function that grabs the users pathname to fetch files from
// this requires user to enter full path - WIP - need to re-think this 
function getFilePath(answers) {
  const path = require('path');
  let filepath = answers.filepath; // '/Users/glitchy81/bootcamp/readme_builder/assets/images'
  console.log('filepath:', filepath)
  // grab the filename
  let file = 'screenshot.png';
  // join the filepath and filename 
  let fullPath = `${filepath}/${file}`
  // console.log('fullpath:', fullPath)
  return `![Product Screenshot](${fullPath})`;
}

// a function to find any additional screenshots
function findScreenshots() {
  // import path
  // const path = require('path');
  // readdir requires user to enter full path - WIP - need to re-think this too
  const pathToFiles = '../assets/images/'
  // const pathToFiles = '/Users/glitchy81/bootcamp/readme_builder/assets/images'
  // iterate 
  fs.readdir(pathToFiles, function (err, files) {
    // if not found - error
    if (err) {
      console.error("Could not find the directory.", err);
      return;
    }
    // iterate
    files.forEach(function (file, index) {
      // join the path and each filename
      let fromPath = path.join(pathToFiles, file);
      console.log('found in path:', fromPath)
      // append each found file
      return `![Product Screenshot](${fromPath})`;
    })
  }

  )
};

// html function - WIP
function genTop() {
  return `
  <!-- Readme top-->
  <a name="readme-top"></a>
  `
};

function backToTop() {
  return `
  <p align="right">(<a href="#readme-top">back to top</a>)</p>
  `
};

function genRepoMap(answers) {
  // generates a repo map of various links to visit
  return `
  <div align="center">
    <h3>"SPEEDME THAT README!"</h3>
    <a href="${answers.github}/"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="${answers.github}/">View Project</a>
    ·
    <a href="${answers.github}/issues">Report Bug</a>
    ·
    <a href="${answers.github}/issues">Request Feature</a>
    ·
    <a href="https://github.com/${answers.username}?tab=repositories">Check out my work</a>
    ·
  </div>
  <br>
  `
};

// [TODO]: generate module script:

function generateHeader() {

  return `
  <div align="center">
  \t<img src="../assets/images/header.png" alt="header-image" width="800" height="200">
  </div>
  <br>
  `

}

const generateToC = (headingsMVP) => {
  // console.log('are headingsMVP making toc:', headingsMVP);
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
    For more information, please visit this link: [${license}](${chosenLicense})
  `;
};

// generate badge at top of readme  - answers must be included here for badge to render 
const generateBadgesSection = (answers, chosenBadge) => {
  // console.log('license chosen:', answers.license);
  // console.log('badge url chosen:', chosenBadge);
  // license shield only
  // return `
  //   <div align="center">
  //     \t<img src="${chosenBadge}" alt="license-badge-image">
  //   </div>  
  //   <br>
  // `;
  // add additional badges (for pro)
  return `
  <span style="display:block" align="center" class="shields">

  [![Stargazers][stars-shield]][stars-url]
  [![Issues][issues-shield]][issues-url]
  [![License][license-shield]][license-url]
  [![LinkedIn][linkedin-shield]][linkedin-url]

  </span>
  `
};

const generateOpenSourceSection = (answers) => {
  // basic contribution notice (included)
  // if opensource (add covenant info)
  return `
    ## ${capitalise(answers.title)} is an Open Source Project:
    [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)\n
    ### Code of Conduct:
    Learn more about open source code of conduct:
    [Contributor Covenant](https://www.contributor-covenant.org/)\n
    Read the full code of conduct here:
    [English (HTML version)](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)\n
    ### Attribution
    Contributor Covenant is included in this open source project.  Read the [license.](https://github.com/EthicalSource/contributor_covenant/blob/release/LICENSE.md)
    `
};

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
  `
};

// pro feature: add all the markdown and badge links
function hiddenMarkdown(answers, chosenBadge, chosenLicense) {
  // console.log(`[stars-shield]: https://img.shields.io/github/stars/${answers.username}/${answers.title.toLowerCase().split(' ').join('_')}.svg?style=for-the-badge`)
  return `
  [stars-shield]: https://img.shields.io/github/stars/${answers.username}/${answers.title.toLowerCase().split(' ').join('_')}.svg?style=for-the-badge
  [stars-url]: ${answers.github}/stargazer
  [issues-shield]: https://img.shields.io/github/issues/${answers.username}/${answers.title.toLowerCase().split(' ').join('_')}.svg?style=for-the-badge
  [issues-url]: ${answers.github}/issues
  [license-shield]: ${chosenBadge}
  [license-url]: ${chosenLicense}
  [linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
  [linkedin-url]: ${answers.linkedin}
  `
};

function genProjectLinks(answers) {
  return `

  ## Deployment & Repo links:
  
  Project Repo Link: [${answers.github}](${answers.github})

  Deployed Project Link: [${answers.github}](${answers.deploy})
  `
};

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

  console.log('\nAnswer the questions: (copy & paste from your fave text-editor for best results)\n')
  // console.log('\n👻💬 MVP Headings are: ', headingsMVP)

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
      message: '📟💬 Descscribe your project here: (User Story sub-headings to follow):',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a summary.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'motivation',
      message: '📟💬 What was your motivation behind the project?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a motivation comment.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'challenges',
      message: '📟💬 What challenges did you face and overcome?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a challenges comment.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'usps',
      message: '📟💬 What are the Unique Selling Points of your final product?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a U.S.P comment.';
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
      message: '📟💬 What is your full github repo URL?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a repo URL.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'deploy',
      message: '📟💬 What is the full deployment URL?',
      validate: function (answer) {
        if (answer.length < 1) {
          return '❗ You must provide a deployment URL.';
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
      ],
      default: 'LinkedIn',
      validate: function (answer) {
        if (!answer.includes('LinkedIn')) {
          throw new Error('❗ You must select LinkedIn.');
        }
        return true;
      }
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
    {
      type: 'list',
      name: 'header',
      message: '📟💬 Have you added a project header image? (make sure you add a header.png to assets/images!)',
      choices: ['yes', 'no'],
      default: 'yes'
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

  console.log('\n📟💬 You chose License:', answers.license);

  // Lightweight readme done - time to write it
  generateAndWriteReadme(headingsMVP, answers, chosenLicense, chosenBadge);

};

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
    console.log('📟💬 SPEED_ME created your README! 🎉🎉\n');
    console.log('📟💬 You can access it via the "output" folder within this repo.\nIf you enjoyed using this program, please let me know!\n');
    console.log('📟💬 This program will now terminate: GOOD DAY!\n')
  } catch (error) {
    console.error('❗ Error generating or writing README.md file:', error);
  }
};

// [TODO] The generateMarkdown module - must add finalAnswers/proAnswers

const generateMarkdown = ({ headingsMVP, answers, chosenLicense, chosenBadge }) => { // chosenHeadings = [], finalAnswers = {} 
  // console.log('opensource?: ',answers.opensource)
  // for MVP
  let tocSection = generateToC(headingsMVP);
  let openSource = '';
  // open source section
  if (answers.opensource === 'yes') {
    openSource = `
    ${generateOpenSourceSection(answers)};
    `
  }
  let includeHeader = '';
  if (answers.header === 'yes') {
    includeHeader = `${generateHeader()}`
  }
  // usageScreenshot = '';
  // if (answers.screenshot === 'yes') {
  //   usageScreenshot = `
  //   // ${ getFilePath(answers) }`;
  //   // console.log(answers.screenshot, usageScreenshot)
  // }

  let screenshot = '';
  let addScreenshots = '';
  if (answers.screenshot === 'yes') {
    screenshot = `
    ![Product Screenshot](../assets/images/screenshot.png)`;
    // console.log(answers.screenshot, usageScreenshot)

    // a function call that adds multiple screenshots here - based iterating through *.png's in folder
    // addScreenshots = `
    // ${ findScreenshots() }
    // `
    // console.log(addScreenshots) // undefined WIP
  }

  // if file path contains filename ?

  return `
    ${genTop()}
    ${generateBadgesSection(answers, chosenBadge)}
    ${includeHeader}

    # ${answers.title.split(' ').map(capitalise).join(' ')}
    ${genRepoMap(answers)}

    ## Table of Contents\n
    ${tocSection.replace(/\n/g, '\n  ')}
    #

    ## Project Summary\n
    ${capitalise(answers.description)}\n
    ### Motivation
    ${capitalise(answers.motivation)}\n
    ### Challenges
    ${capitalise(answers.challenges)}\n
    ### Unique Selling Points
    ${capitalise(answers.usps)}\n
    #

    ${backToTop()}

    ## Installation\n
    ${capitalise(answers.installation)}\n

    ## Usage\n
    ${capitalise(answers.usage)}\n
    ${screenshot}
    
    ## Tests\n
    ${capitalise(answers.tests)}\n

    ## Contributing\n
    ${capitalise(answers.contributing)}\n

    ${backToTop()}
    
    ${openSource}

    ${generateLicenseSection(answers.license, chosenLicense)}

    ${generateQuestionsSection(answers)}

    ${hiddenMarkdown(answers, chosenBadge, chosenLicense)}

    ${backToTop()}

    ${genProjectLinks(answers)}
    
  `.replace(/^ +/gm, '');
};

run();
