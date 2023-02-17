// // license links 
// const licenseLinks = {

//     apache: 'https://choosealicense.com/licenses/apache-2.0/' ,
//     gnu: 'https://choosealicense.com/licenses/agpl-3.0/',
//     mit: 'https://choosealicense.com/licenses/mit/',
// };

// // create a license array - use link to link them to the object item!
// // const licenses = [
// //   { name: 'Apache 2.0', link: licenseLinks.apache },
// //   { name: 'GNU AGPL v3.0', link: licenseLinks.gnu },
// //   { name: 'MIT', link: licenseLinks.mit }
// // ];

// const licenses = [
//   { name: 'Apache 2.0', value: 'apache' },
//   { name: 'GNU AGPL v3.0', value: 'gnu' },
//   { name: 'MIT', value: 'mit' }
// ];

// // test accessing 
// // console.log(${licenseLinks.apache});
// let chosen = `Chosen license was: ${licenseLinks.apache}`
// console.log(chosen)

// // if 0 chosen, allow the arg
// const setupReadme = async (chosenHeadings = []) => {
//   const { title, description, github, license } = await inquirer.prompt([
//     {
//       type: 'input',
//       name: 'title',
//       message: 'What is the title of your project?'
//     },
//     {
//       type: 'input',
//       name: 'description',
//       message: 'What is the project description?'
//     },
//     {
//       type: 'input',
//       name: 'github',
//       message: 'What is your github repo URL?'
//     },
//     {
//       type: 'list',
//       name: 'license',
//       message: 'Please choose a license type:',
//       choices: licenses.map(license => license.name),
//       // press enter for default
//       default: licenses[0].name
//     },
//   ]);

//   // return license in order to access it
//   return license;
// }

// // conditional to check which license and assign the correct url
// if (licenses.includes(licenseLinks.apache)) {
//   console.log("license selected:", licenses)
// } 

// find the selected license in the licenses array and get its link
// const selectedLicense = licenses.find(l => l.name === license);
// const licenseLink = selectedLicense.link;

// console.log('Chosen license:', license);
// console.log('License link:', licenseLink); 

// 

// const selectedLicense = licenses.find(l => l.name === setupReadme());
// const selectedLicenseUrl = licenseLinks[selectedLicense.value];
// console.log(`Selected license: ${selectedLicense.name}, URL: ${selectedLicenseUrl}`);


// const selectedLicense = licenses.find(l => l.name === license);
// const selectedLicenseUrl = licenseLinks[selectedLicense.value];
// console.log(`Selected license: ${selectedLicense.name}, URL: ${selectedLicenseUrl}`);


// 

const licenses = [
  { name: 'Apache 2.0', value: 'apache' },
  { name: 'GNU AGPL v3.0', value: 'gnu' },
  { name: 'MIT', value: 'mit' }
];

const licenseLinks = {
  apache: 'https://choosealicense.com/licenses/apache-2.0/' ,
  gnu: 'https://choosealicense.com/licenses/agpl-3.0/',
  mit: 'https://choosealicense.com/licenses/mit/',
};

// ...

const { license } = await inquirer.prompt([
  {
    type: 'list',
    name: 'license',
    message: 'Please choose a license type:',
    choices: licenses,
    default: 'Apache 2.0'
  },
]);

const selectedLicense = licenses.find(l => l.name === license);
const selectedLicenseUrl = licenseLinks[selectedLicense.value];
