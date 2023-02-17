// a more organised idea: break up the code into utils and import them
import { run } from './utils/index.js';

// thanks google for the .replace(/\n/g, '\n  ') !
const generateMarkdown = ({ title, description, github, license, chosenHeadings = [] }) => {
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

module.exports = {
  generateMarkdown,
};