const markRegExp = /^(.+?)\s/
const sharpRegExp = /^\#/
const unorderedListRegExp = /^\-{1}$/
const orderedListRegExp = /^\d\.$/

/**
 * 将 md_arr 转为 html_arr
 * @param {*} md_arr
 * @returns
 */
function createHtmlPoor(md_arr) {
  const html_arr = []
  let last_mark = ''
  let uid = 0

  md_arr.forEach((md) => {
    const matched = md.match(markRegExp)
    if (matched) {
      let mark = matched[1]
      let input = matched.input
      const tag_content = input.replace(markRegExp, '')
      // # 标签
      if (sharpRegExp.test(mark)) {
        const tag = `h${mark.length}`

        if (last_mark === mark) {
          // 当前标签与上一个标签相同
          html_arr[html_arr.length - 1].tags.push(
            `<${tag}>${tag_content}</${tag}>`,
          )
        } else {
          uid++
          last_mark = mark
          html_arr.push({
            tag: `${tag}-${uid}`,
            type: 'single',
            tags: [`<${tag}>${tag_content}</${tag}>`],
          })
        }
      }
      // 无序列表
      if (unorderedListRegExp.test(mark)) {
        const tag = `li`
        if (unorderedListRegExp.test(last_mark)) {
          html_arr[html_arr.length - 1].tags.push(
            `<${tag}>${tag_content}</${tag}>`,
          )
        } else {
          uid++
          last_mark = mark
          html_arr.push({
            tag: `ul-${uid}`,
            type: 'wrap',
            tags: [`<${tag}>${tag_content}</${tag}>`],
          })
        }
      }
      // 有序列表
      if (orderedListRegExp.test(mark)) {
        const tag = `li`

        if (orderedListRegExp.test(last_mark)) {
          html_arr[html_arr.length - 1].tags.push(
            `<${tag}>${tag_content}</${tag}>`,
          )
        } else {
          uid++
          last_mark = mark
          html_arr.push({
            tag: `ol-${uid}`,
            type: 'wrap',
            tags: [`<${tag}>${tag_content}</${tag}>`],
          })
        }
      }
    }
  })

  return html_arr
}

/**
 * 将 md_arr 转为 HTML 字符串
 * @param {*} html_arr
 */
function compilerHTML(md_arr) {
  const html_arr = createHtmlPoor(md_arr)
  let html_str = ''

  for (let i = 0; i < html_arr.length; i++) {
    const html = html_arr[i]
    const tag = html.tag

    if (html.type === 'single') {
      html.tags.forEach((tmp) => {
        html_str += tmp
      })
    } else if (html.type === 'wrap') {
      const wrap_tag = `${tag.split('-')[0]}`
      html_str += `<${wrap_tag}>`
      html.tags.forEach((tmp) => {
        html_str += tmp
      })
      html_str += `</${wrap_tag}>`
    }
  }

  return html_str
}

module.exports = {
  compilerHTML,
}
