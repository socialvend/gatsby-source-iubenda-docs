## gatsby-source-iubenda-docs

Source plugin for pulling in Iubenda documents at build-time for Gatsby.

### Install

`npm install socialvend/gatsby-source-iubenda-docs --save`

### How to use

In your `gatsby-config.js`, add objects representing different Iubenda documents.

A document object has the following options:

- `location` (required) must be the slug of the document, made up usually of the type of document and the document ID. For example, `privacy-policy/78618891` or `terms-and-conditions/78618891`.
- `locale` (defaults to 'en') is useful if you want to apply locale configurations further downstream
- `slug` (optional) is useful for assigning a particular slug when creating pages in your Gatsby builds.

```
plugins: [
  {
    resolve: `gatsby-source-iubenda`,
    options: {
      documents: [
        {
          location: `privacy-policy/78618891`,
          slug: '/privacy-policy',
          locale: 'en'
        },
        {
          location: `terms-and-conditions/78618891`,
          slug: '/terms-and-conditions',
          locale: 'en'

        },
        {
          location: `privacy-policy/85013973`,
          slug: 'fr/privacy-policy',
          locale: 'fr'
        },
        {
          location: `terms-and-conditions/85013973`,
          slug: 'fr/terms-and-conditions',
          locale: 'fr'
        }
      ]
    }
  }
]
```

You'll then want to query the available documents, either just the node ids for creating pages or getting all of them in one query, like so:

```
query MyQuery {
  allIubendaDocument {
    edges {
      node {
        id
        slug
        title
        locale
        htmlString
      }
    }
  }
}
```
