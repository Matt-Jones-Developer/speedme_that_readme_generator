function capitalize(str) {
  if(typeof str === 'string') {
    return str[0].toUpperCase() + str.slice(1);
  }
  return str;
}


"capitalize each word of this sentence".split(' ').map(capitalize).join(' ');