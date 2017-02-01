'use strict'

export const slugify = (text) => {
  return text.toString().toLowerCase()
  .replace(/\s+/g, '-')           // Replace spaces with -
  .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
  .replace(/\-\-+/g, '-')         // Replace multiple - with single -
  .replace(/^-+/, '')             // Trim - from start of text
  .replace(/-+$/, '')             // Trim - from end of text
}

// Extract n characters of preview text, rounded to the closest full word
export const cutAtWord = (text, characters) => {
  var lastCharacter = text.lastIndexOf(' ', characters)
  return text.substring(0, lastCharacter)
}

export const commaSeparate = (array) => array.join(', ')

export const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}
