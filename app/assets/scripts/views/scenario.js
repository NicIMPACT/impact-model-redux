'use strict'
import React from 'react'
import { connect } from 'react-redux'
import marked from 'marked'
import fm from 'front-matter'

import { loadText } from '../utils/load-text.js'

// Components
import ProjectArticles from '../components/project-articles'
import RelatedArticles from '../components/related-articles'

var Scenario = React.createClass({
  propTypes: {
    articles: React.PropTypes.array,
    article: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      articleBody: '',
      articleMetadata: {}
    }
  },

  componentWillMount: function () {
    const metadata = this.props.articles.find((article) => article.id === this.props.article)
    loadText(metadata.url).then((text) => {
      const body = marked(fm(text).body)
      this.setState({
        articleMetadata: metadata,
        articleBody: body
      })
    })
  },

  render: function () {
    const articleMetadata = this.state.articleMetadata
    const articles = this.props.articles
    return (
      <div className='article'>
        <header className='article__header'>
          <h1>{this.state.articleMetadata.title}</h1>
        </header>
        <div className='page__article-body'>
          <div dangerouslySetInnerHTML={{__html: this.state.articleBody}}></div>
        </div>
        <ProjectArticles articleMetadata={articleMetadata} articles={articles} />
        <RelatedArticles articleMetadata={articleMetadata} articles={articles} />
      </div>
    )
  }
})

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function mapStateToProps (state) {
  return {
    articles: state.article.articles,
    article: state.article.article
  }
}

module.exports = connect(mapStateToProps)(Scenario)
