
module.exports.convertToSlug = function(text) {
    const a = 'àáäâãẽèéëêĩìíïîõòóöôũùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;'
    const b = 'aaaaaeeeeeiiiiiooooouuuuuncsyoarsnpwgnmuxzh------'
    const p = new RegExp(a.split('').join('|'), 'g')
    return text.toString().toLowerCase().trim()
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special chars
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[\s\W-]+/g, '-') // Replace spaces, non-word characters and dashes with a single dash (-)
}