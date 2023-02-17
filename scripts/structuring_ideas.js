// including generateTableOfContents function to access the chosen headings (selected by user)
// generateTOC would have html <details><summary><a href=""> etc 

const generateReadme = (answers) =>
  `
  # ${answers.title}

  ## Description
  ${answers.description}

  ## Table of Contents
  ${generateTableOfContents(answers.headings)}

  ## Overview
  ${generateOverviewSection()}

  ## Built With
  ${generateLanguageLogosSection()}

  ## User Story
  ${generateUserStorySection()}

  ## Installation
  ${generateInstallationSection()}

  ## Usage
  ${generateUsageSection()}

  ## Contributing
  ${generateContributingSection()}

  ## License
  ${generateLicenseSection()}

  ## Tests
  ${generateTestsSection()}

  ## Questions
  ${generateQuestionsSection(answers.github, answers.linkedin)}
  `;

