'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import c from 'classnames'
import _ from 'lodash'

// Actions
import { updateArticleFilters, updateArticlePage, updateMobileFilters } from '../actions'

// Components
import ListArticleCard from './list-article-card.js'

// Constants
import { articleBrowsePageLength } from '../constants.js'

// Utils
import { translate } from '../utils/translation'

export class BrowseList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.clearFilters = this.clearFilters.bind(this)
    this.removeOneFilter = this.removeOneFilter.bind(this)
    this.handleMobileFilter = this.handleMobileFilter.bind(this)
  }

  componentWillUnmount () {
    this.props.dispatch(updateArticleFilters([]))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.articleFilters !== this.props.articleFilters && this.props.articlePage !== 0) {
      this.goToPage(0)
    }
  }

  goToPage (page, e) {
    if (e) e.preventDefault()
    window.scroll(0, ReactDOM.findDOMNode(this).offsetTop - 50)
    this.props.dispatch(updateArticlePage(page))
  }

  sortArticles (articles, articleFilters) {
    const sortedArticles = articles.slice(0)
    if (articleFilters.length) {
      sortedArticles.sort((a, b) => b.matches - a.matches)
    } else {
      sortedArticles.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
    return sortedArticles
  }

  filterArticles (articles, articleFilters) {
    if (articleFilters.length) {
      return articles.filter((article) => {
        const metadata = _.concat(
          [article.briefType],
          article.tags,
          article.commodities,
          article.locations,
          article.project
        ).filter(Boolean)
        const matches = _.intersection(metadata, articleFilters).length
        article.matches = matches
        return matches
      })
    }
    return articles
  }

  clearFilters (e) {
    e.preventDefault()
    this.props.dispatch(updateArticleFilters([]))
  }

  removeOneFilter (e) {
    const toRemove = e.target.id
    this.props.dispatch(updateArticleFilters(this.props.articleFilters.filter(f => f !== toRemove)))
  }

  handleMobileFilter (e) {
    e.preventDefault()
    this.props.dispatch(updateMobileFilters(true))
  }

  render () {
    const { articlePage, articleFilters, path } = this.props
    let articles = this.sortArticles(this.filterArticles(this.props.articles, articleFilters), articleFilters)
    const articleCount = articles.length
    articles = articles.slice(articleBrowsePageLength * articlePage, articleBrowsePageLength * articlePage + articleBrowsePageLength)

    // show first/last/two on each side
    const lastPage = Math.ceil(articleCount / articleBrowsePageLength) - 1

    const pages = _.uniq([
      0,
      lastPage,
      articlePage - 2,
      articlePage - 1,
      articlePage,
      articlePage + 1,
      articlePage + 2
    ]
    .map(a => Math.min(Math.max(a, 0), lastPage) + 1)).sort((a, b) => a - b)

    // add ellipses
    if (pages.length > 3 && pages[1] !== 2) pages.splice(1, 0, '...')
    if (pages.length > 3 && pages[pages.length - 2] !== lastPage) pages.splice(pages.length - 1, 0, '...')

    const ClearFilters = articleFilters.length
    ? <a className='filter__selects__clear link__underline' href='' onClick={this.clearFilters}>Clear All Filters</a>
    : ''

    return (
      <section className='browse__article-list'>
        <header className='article-list__header'>
          <h5 className='header--small'>Results <span className='result-count'>({articleCount})</span></h5>
          <a className='button button--main filter__mobile' onClick={this.handleMobileFilter} href='#'>Filter</a>
          {articleFilters.length ? <div className='filter__selects'>
            <ul>
              {articleFilters.map(filter => {
                return (
                  <li
                    key={filter}
                    id={filter}
                    onClick={this.removeOneFilter}
                  >
                    {translate(filter)}
                  </li>
                )
              })}
              <li className='clear-filters'>{ClearFilters}</li>
            </ul>
          </div> : ''}
        </header>
        {articles.map((article, i) => {
          return (
            <ListArticleCard
              article={article}
              path={path}
              key={'list-article-card' + i}
            />
          )
        })}
        <ul className='browse__pagination'>
          <li onClick={() => this.goToPage(articlePage - 1)} className={c('browse__pagination-button', 'browse__pagination-button--back', 'collecticon-chevron-left', {'pagination-button--disabled': articlePage === 0})}>
            <a className='links-next-prev' href=''>Previous</a>
          </li>
          {pages.map((page, i) => {
            return isNaN(page)
            ? <li key={`ellipses-${i}`} className='browse__pagination-button'><a href=''>{page}</a></li>
            : <li key={page} className={c('browse__pagination-button', { active: articlePage === (page - 1) })}><a onClick={(e) => this.goToPage(page - 1, e)} href=''>{page}</a></li>
          })}
          <li onClick={() => this.goToPage(articlePage + 1)} className={c('browse__pagination-button', 'browse__pagination-button--forward', 'collecticon-chevron-right', {'pagination-button--disabled': articlePage === lastPage})}>
            <a className='links-next-prev' href=''>Next</a>
          </li>
        </ul>
      </section>
    )
  }
}

// Set default props
BrowseList.propTypes = {
  dispatch: React.PropTypes.func,
  articles: React.PropTypes.array,
  articleFilters: React.PropTypes.array,
  articlePage: React.PropTypes.number,
  path: React.PropTypes.string
}

export default BrowseList
