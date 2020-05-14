const axios = require('axios')
const crypto = require('crypto')

exports.sourceNodes = async ({actions, createNodeId}, {documents}) => {

  // Create nodes here, generally by downloading data from a remote API.
  const {createNode} = actions

  // Get the title from the first heading
  const getTitle = (htmlString, tag = 'h1') => {

    const reg = new RegExp(`<${tag}>[^]*</${tag}>`)
    const titleWithTags = htmlString.match(reg)[0]
    const titleWithoutTags = titleWithTags.replace(/<\/?[^>]+(>|$)/g, '')

    return titleWithoutTags

  }

  // Helper function that processes a photo to match Gatsby's node structure
  const processData = data => {

    const {location} = data

    const nodeId = createNodeId(`iubenda-doc-${location.replace(/[^-a-z0-9]+/i, '')}`)
    const nodeContent = JSON.stringify(data)
    const nodeContentDigest = crypto
      .createHash('md5')
      .update(nodeContent)
      .digest('hex')

    const nodeData = {
      ...data,
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        content: nodeContent,
        type: 'IubendaDocument',
        contentDigest: nodeContentDigest
      }
    }

    return nodeData

  }

  /* eslint-disable-next-line no-console */
  console.info('Fetching document(s) from iubenda')

  return Promise.all(

    documents.map(async ({location, slug, locale = 'en'}) => {

      const liveDoc = await axios.get(`https://www.iubenda.com/api/${location}`)

      const {data: {content: htmlString}} = liveDoc

      const data = {
        location,
        title: getTitle(htmlString),
        htmlString,
        locale,
        ...(slug && {slug})
      }

      const nodeData = processData(data)

      return createNode(nodeData)

    })
  )
}
