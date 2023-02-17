// testing node and inquirer using html 

const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const { type } = require('os');

const writeFileAsync = util.promisify(fs.writeFile);

setupType()
function setupType() {
  // what type of readme (light or pro)
  // ideally I'd like a list that user has to press 'spacebar' on to check - 
  // same for 'headings' prompt - i.e what headings would you like?  [1] table of contents [2] Tests [3] usage etc 
  inquirer.prompt([
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

    // how do we compare this result now?
    // catch misspells, garbage too - if offer 2 choices as an option list!

    // log the answers (for setup)
    .then(answers => {
      console.info('Type of readme chosen:', answers.setup);
      // IF user selects 'lightweight' - don't offer headings
      if (answers.setup === 'Lightweight') {
        // skip to title/description section (function call)
        console.log('simplified readme was chosen, skipping headings now...')
        setUpReadme()
      } else {
        console.log('Professional readme selected, choose headings now...')
        setupHeadings()
      }

    })
}

function setupHeadings() {
  inquirer.prompt([
    {
      // try checkboxes
      type: 'checkbox',
      name: 'headings',
      message: 'Please choose your readme headings: ("Title" and "Description" are mandatory.)',
      // I'd like to do 'badges' and whether or not to add html for the header, logo, centred lists and div elements and screenshots
      choices: ['User Story', 'Table of Contents', 'Features', 'Usage', 'Installation', 'Issues', 'Contributing', 'Project Links', 'License']
    }
  ])

    .then(answers => {
      console.info('Here are the headings chosen:',
        `\n${answers.headings}`);
      setUpReadme(answers)
        .then((answers) => writeFileAsync('README.md', generateReadme(answers)))
        .then(() => console.log('Successfully wrote to README.md'))
        .catch((err) => console.error(err));


    })
}

const setUpReadme = () =>
  inquirer.prompt([
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
  ])

    .then(answers => {
      console.info('Here is a summary of the project:',
        `\n${answers.title}.\n ${answers.description}.\n ${answers.github}\n ${answers.linkedin}\n`);

    })

    .then((answers) => writeFileAsync('README.md', generateReadme(answers)))
    .then(() => console.log('Successfully wrote to README.md'))
    .catch((err) => console.error(err));

// render the readme.md
// options to add:
// could add name="some_class_name" to each tag that needs appending with input data - see 'to-top' a tags
// choose which license type - select from a 'choices: checkbox'
// ability to choose a path for all the images (or default: 'assets/images/screenshots/...)
// user must enter correct github repo pathname -which is then inserted in correct locations, 
// replacing 'full_repo_url' with full project repo address (allow pasting)
// appending for /issues /issues (bugs) and a users 'repositories' url  
// replace project_title with project title
// adv. select the table of contents options via checkboxes?
// language logo checkbox - each logo dynamically added if selected!


// !! MEET MVP FIRST - BEFORE ALL THIS !!

const generateReadme = (answers) =>

  `
  Headings printed: ${answers.headings}

  `

  // ` all undefined
  // Project Title: ${answers.title}
  // Project Description: ${answers.description}
  // Github: ${answers.github}
  // LinkedIn: ${answers.linkedin}

  // `


// full (eventual version of the call readme - must add all the interpolations!)
// const generateReadme = (answers) =>
//   `
//   <!-- readme top -->
//   <a name="readme-top"></a>

//   <!-- project shields -->
//   <span style="display:block" align="center" class="shields">

//     [![Stargazers][stars-shield]][stars-url]
//     [![Issues][issues-shield]][issues-url]
//     [![License][license-shield]][license-url]
//     [![LinkedIn][linkedin-shield]][linkedin-url]

//   </span>

//   <!-- Header -->
//   <div align="center">
//     <img src="path_to_images_header" alt="header-image" width="800" height="400">
//   </div>
//   <br />

//   <!-- Logo -->
//   <div align="center">

//   <a href="full_repo_url">
//     <img src="path_to_images_logo" alt="Logo" width="100" height="100">
//   </a>

//   <!-- Title, Summary and Anchors -->
//   #

//   <h2 align="center">append_project_title</h2>

//     <p align="center">

//     <-- project desc. goes here -->
//     append_project_description

//     <br />
//     <a href="full_repo_url"><strong>Explore the docs »</strong></a>
//     <br />
//     <br />
//     <a href="full_repo_url">View Project</a>
//     ·
//     <a href="full_repo_url/issues">Report Bug</a>
//     ·
//     <a href="full_repo_url/issues">Request Feature</a>
//     ·
//     <a href="user_repos_url">Check out my work</a>
//     ·
//     </p>
//   </div>

//   #

//   <!-- TABLE OF CONTENTS -->
//   <details>
//     <summary>Table of Contents</summary>
//     <ol>
//       <li>
//         <a href="#about-the-project">About The Project</a>
//         <ul>
//         <li><a href="#overview">Overview</a></li>
//         </ul>
//         <ul>
//           <li><a href="#built-with">Built With</a></li>
//         </ul>
//         <ul>
//         <li><a href="#the-product">The Product</a></li>
//         </ul>
//       </li>
//       <li>
//         <a href="#getting-started">Getting Started</a>
//         <ul>
//           <li><a href="#prerequisites">Prerequisites</a></li>
//           <li><a href="#installation">Installation</a></li>
//         </ul>
//       </li>
//       <li><a href="#usage">Usage</a></li>
//       <li><a href="#roadmap">Roadmap</a></li>
//       <li><a href="#contributing">Contributing</a></li>
//       <li><a href="#license">License</a></li>
//       <li><a href="#contact">Contact</a></li>
//       <li><a href="#acknowledgments">Acknowledgments</a></li>
//     </ol>
//   </details>

//   <p align="right">(<a href="#readme-top">back to top</a>)</p>

//   <!-- Product screenshot: -->

//   [![Product Name Screen Shot][product-screenshot]](path_to_product_screenshot)

//   <!-- ABOUT THE PROJECT - full project description here -->
//   ## About The Project

//   project_description

//   <!-- Product screenshot 2: -->

//   [![Product Name Screen Shot][product-screenshot-2]](path_to_product_screenshot_2)

//   <!-- Product Feature Overview -->
//   ## Overview

//   product_overview

//   <!-- The Product -->

//   Product Screenshots:

//   [![Product Name Screen Shot][product-screenshot-3]](path_to_product_screenshot_3)
//   [![Product Name Screen Shot][product-screenshot-4]](path_to_product_screenshot_4)

//   ## Criteria

//   append_project_criteria

//   Have a clean repository that meets quality coding standards (file structure, naming conventions, follows best practices for class/id naming conventions, indentation, quality comments, etc.).

//   Have a quality README (with unique name, description, technologies used, screenshot, and link to deployed application).

//   #   


//   ### Built With:

//   <!-- languages logos -->

//   append_project_logos

//   ![js-logo]::: [![JavaScript]][javascript-url] ![html5-logo]::: [![HTML5]][html5-url] ![css-logo]::: [![CSS]][css-url] ![heart-logo]::: ![coding]


//   <p align="right">(<a href="#readme-top">back to top</a>)</p>

//   #

//   <!-- GETTING STARTED [USAGE] -->

//   ## Getting Started

//   append_getting_started

//   #

//   ### Prerequisites

//   append_prerequisites_or_NA

//   #

//   ### Installation

//   <!-- USAGE EXAMPLES -->
//   ## More Screenshots

//   Screenshot of the programs output with
//   fully responsive design:

//   ![tablet-screenshot1]

//   <div align="center">
//     <img src="path_to_images_screenshots_mobile_1">
//     <img src="path_to_images_screenshots_mobile_2">
//   </div>


//   Console log:

//   ![console-output-screenshot]
//   ![console-output-screenshot-2]

//   <p align="right">(<a href="#readme-top">back to top</a>)</p>


//   ----------------------------------

//   <!-- ROADMAP -->
//   ## Roadmap

//   [append list here]

//   #

//   <!-- UX/UI DESIGN -->
//   ## UX/UI Design

//   Screenshot of the web apps UI design stage:

//   [![Design Screen Shot][wireframe-screenshot]](path_to_images_wireframing)

//   [![Design Screen Shot][wireframe-screenshot-2]](path_to_images_wireframing_2)

//   <p align="right">(<a href="#readme-top">back to top</a>)</p>

//   #

//   <!-- CONTRIBUTING -->
//   ## Contributing

//   [append contributing - if selected]

//   Project featured these fine coders and designers:

//   <div align="center">

//     <p align="left"><a href="path_to_users_github">name</a></p>
//     <p align="left"><a href="path_to_users_github">name</a></p>
//     <p align="left"><a href="path_to_users_github">name</a></p>

//   </div>

//   <p align="right">(<a href="#readme-top">back to top</a>)</p>

//   #

//   <!-- LICENSE -->
//   ## License

//   Distributed under the MIT License. See LICENSE file for more information.

//   #

//   <!-- CONTACT -->
//   ## Contact

//   append_user_name - [user_twitter_id](twitter_url)

//   #

//   <p align="right">(<a href="#readme-top">back to top</a>)</p>


//   ## Project links

//   Project Repo Link: [full_project_repo_url)


//   Deployed Project Link: [full_project_deployment_url)

//   <!-- ACKNOWLEDGMENTS -->
//   ## Acknowledgments
  
//   * [Developed from this original README Template](https://github.com/othneildrew/Best-README-Template)

//   <p align="right">(<a href="#readme-top">back to top</a>)</p>

//   ----------------------------------


//   <!-- MARKDOWN LINKS & IMAGES -->
//   <!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
//   [contributors-shield]: https://img.shields.io/github/contributors/[append_username_project].svg?style=for-the-badge
//   [contributors-url]: [append_user_repo_url]/graphs/contributors
//   [forks-shield]: https://img.shields.io/github/forks/[append_username_project].svg?style=for-the-badge
//   [forks-url]: [append_full_user_repo_url]/network/members
//   [stars-shield]: https://img.shields.io/github/stars/[append_username_project].svg?style=for-the-badge
//   [stars-url]: [append_full_user_repo_url]/stargazer
//   [issues-shield]: https://img.shields.io/github/issues/[append_username_project].svg?style=for-the-badge
//   [issues-url]: [append_full_user_repo_url]/issues
//   [license-shield]: https://img.shields.io/github/license/[append_username_project].svg?style=for-the-badge
//   [license-url]: [append_full_user_repo_url]/blob/main/LICENSE.txt
//   [linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
//   [linkedin-url]: append_user_linkedin_url
//   [product-screenshot]: append_path_images_screenshots_app_1
//   [product-screenshot-2]: append_path_images_screenshots_app_2
//   [product-screenshot-3]: append_path_images_screenshots_app_3
//   [product-screenshot-4]: append_path_images_screenshots_app_4
//   [console-output-screenshot]: append_path_to_images_screenshots/console_output.png
//   [console-output-proof-of-API2]: append_path_to_images_screenshots/console_output_tm_api.png
//   [wireframe-screenshot]: append_path_to_images_screenshots/app_wireframing.png
//   [wireframe-screenshot-2]: append_path_to_images_screenshots/app_wireframing_2.png
//   [tablet-screenshot1]: append_path_to_images_screenshots/ipad_screenshot.png
//   [mobile-screenshot1]: append_path_to_images_screenshots/mobile_screenshot_1.png
//   [mobile-screenshot2]: append_path_to_images_screenshots/mobile_screenshot_2.png
//   [javascript-url]: https://www.javascript.com
//   [html5-url]: https://html5.org/
//   [css-url]: https://www.w3.org/Style/CSS/Overview.en.html
//   [coding-url]: https://github.com/Matt-Jones-Developer
//   [js-logo]: assets/images/logos/js.svg
//   [html5-logo]: assets/images/logos/html5.svg
//   [css-logo]: assets/images/logos/css3.svg
//   [heart-logo]: assets/images/logos/coding_love_logo.png

//   `

// HTML version
// const generateHTML = (answers) =>
//   `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
//   <title>Document</title>
// </head>
// <body>
//   <div class="jumbotron jumbotron-fluid">
//   <div class="container">
//     <h1 class="display-4">Hi! My name is ${answers.name}</h1>
//     <p class="lead">I am from ${answers.location}.</p>
//     <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
//     <ul class="list-group">
//       <li class="list-group-item">My GitHub username is ${answers.github}</li>
//       <li class="list-group-item">LinkedIn: ${answers.linkedin}</li>
//     </ul>
//   </div>
// </div>
// </body>
// </html>`;

// write to file 
// switch to a readme.md 

// promptUser()
//   .then((answers) => writeFileAsync('index.html', generateHTML(answers)))
//   .then(() => console.log('Successfully wrote to index.html'))
//   .catch((err) => console.error(err));


