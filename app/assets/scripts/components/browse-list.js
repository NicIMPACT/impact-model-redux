'use strict'
import React from 'react'
import classnames from 'classnames'
import _ from 'lodash'

// Actions
import { updateArticleFilters, updateArticleSorting, updateArticlePage } from '../actions'

// Components
import ListArticleCard from './list-article-card.js'

// Constants
import { articleBrowsePageLength } from '../constants.js'

// Utils
import { translate } from '../utils/translation'

export class BrowseList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.handleSortingUpdate = this.handleSortingUpdate.bind(this)
    this.clearFilters = this.clearFilters.bind(this)
    this.removeOneFilter = this.removeOneFilter.bind(this)
  }

  componentWillUnmount () {
    this.props.dispatch(updateArticleFilters([]))
    this.props.dispatch(updateArticleSorting('recency'))
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.articleFilters !== this.props.articleFilters && this.props.articlePage !== 0) {
      this.goToPage(0)
    }
  }

  goToPage (page) {
    this.props.dispatch(updateArticlePage(page))
  }

  handleSortingUpdate (event) {
    this.props.dispatch(updateArticleSorting(event.target.value))
  }

  sortArticles (articles, articleSorting) {
    switch (articleSorting) {
      case 'recency':
        return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
      case 'relevance':
        return articles.sort((a, b) => b.matches - a.matches)
    }
    return articles
  }

  filterArticles (articles, articleFilters) {
    if (articleFilters.length) {
      return articles.filter((article) => {
        const metadata = _.concat([article.briefType], article.commodities, article.locations, article.project).filter((item) => item)
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

  render () {
    const { articlePage, articleFilters, articleSorting, path } = this.props
    let articles = this.sortArticles(this.filterArticles(this.props.articles, articleFilters), articleSorting)
    const articleCount = articles.length
    articles = articles.slice(articleBrowsePageLength * articlePage, articleBrowsePageLength * articlePage + articleBrowsePageLength)

    const highArticle = Math.min(articleCount, articleBrowsePageLength * articlePage + articleBrowsePageLength + 1)

    // show first/last/two on each side
    const lastPage = Math.floor(articleCount / articleBrowsePageLength)
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
    if (pages[1] !== 1) pages.splice(1, 0, '...')
    if (pages[pages.length - 2] !== lastPage - 1) pages.splice(pages.length - 1, 0, '...')

    const ClearFilters = articleFilters.length
    ? <a className='filter__selects__clear link__underline' href='' onClick={this.clearFilters}>Clear All Filters</a>
    : ''

    return (
      <section className='browse__article-list'>
        <header className='article-list__header'>
          <h5 className='header--small'>Results <span className='result-count'>({articleCount})</span></h5>
          <div className='select--wrapper'>
            <select onChange={this.handleSortingUpdate} className='article-list__sort-menu' selected={articleSorting}>
              <option value='recency'>Recent Updates</option>
              <option value='relevance'>Relevance</option>
            </select>
          </div>
          <div className='filter__selects'>
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
            </ul>
            {ClearFilters}
          </div>
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
          <li
            className={classnames('browse__pagination-button', 'browse__pagination-button--back', 'collecticon-chevron-left', {'pagination-button--disabled': articlePage === 0})}
            onClick={() => this.goToPage(articlePage - 1)}><a className='links-next-prev' href=''>Previous</a>
          </li>
          {pages.map((page, i) => {
            return isNaN(page)
            ? <li key={`ellipses-${i}`} className='browse__pagination-button'><a href=''>{page}</a></li>
            : <li key={page} className='browse__pagination-button' onClick={() => this.goToPage(page)}><a href=''>{page}</a></li>
          })}
          <li
            className={classnames('browse__pagination-button', 'browse__pagination-button--forward', 'collecticon-chevron-right', {'pagination-button--disabled': highArticle === articleCount})}
            onClick={() => this.goToPage(articlePage + 1)}><a className='links-next-prev' href=''>Next</a>
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
  articleSorting: React.PropTypes.oneOf(['recency', 'relevance']),
  articlePage: React.PropTypes.number,
  path: React.PropTypes.string
}

export default BrowseList
