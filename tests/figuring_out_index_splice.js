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
    const installationIndex = chosenHeadings.indexOf('Installation');
    if (installationIndex >= 0) {
      installation = `
        ## Installation\n
        ${generateInstallation(answers)}
      `;
      chosenHeadings.splice(installationIndex, 1);
    }

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
      ${installation}
      ${generateMainContentsSection(chosenHeadings)}

      ${generateLicenseSection(answers.license, chosenLicense)}

      ${generateQuestionsSection(answers)}


    `.replace(/^ +/gm, '');
};
