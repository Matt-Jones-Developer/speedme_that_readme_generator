const generateMarkdown = ({ answers, chosenLicense, chosenBadge, chosenHeadings = [], finalAnswers = {} }) => {

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

    }   } catch (error) {
    console.error('❗ Error generating Table of Contents section (user chose not to): ', error);
  }

  // Generate markdown for each section
  const titleSection = `# ${answers.title}`;
  const summarySection = `## Project Summary\n${answers.description}`;

  let proAnswersSection = '';
  if (Object.keys(finalAnswers).length > 0) {
    proAnswersSection = generateProAnswersSection(finalAnswers);
  }

  const licenseSection = generateLicenseSection(answers.license, chosenLicense);
  const questionsSection = generateQuestionsSection(answers);

  // Concatenate markdown sections
  return `
      ${generateBadgesSection(answers, chosenBadge)}

      ${titleSection}

      ${summarySection}

      #
      ${tocSection}
      ${headings}

      ${licenseSection}

      ${questionsSection}

      ${proAnswersSection}
    `.replace(/^ +/gm, '');
};
