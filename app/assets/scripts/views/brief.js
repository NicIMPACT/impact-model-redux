'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import { Link } from 'react-router'
import _ from 'lodash'

// Actions
import { fetchArticle, updateArticleFilters, updateChart } from '../actions'

// Components
import RelatedArticles from '../components/related-articles'
import Chart from '../components/chart'
import ChartLine from '../components/chart-line'
import ChartGroupedBar from '../components/chart-grouped-bar'
import MapComponent from '../components/map'
import Share from '../components/share-button'
import Loading from '../components/loading'
import UhOh from './uhoh'

// Utils
import { translate } from '../utils/translation'
import { findRelatedArticles, findProjectArticles } from '../utils/related'

export class Brief extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.updateArticleFilters = this.updateArticleFilters.bind(this)
    this.updateChart = this.updateChart.bind(this)

    if (this.props.metadata) {
      props.dispatch(fetchArticle(this.props.metadata.url))
    }
  }

  componentDidUpdate () {
    if (this.props.metadata) {
      this.addCharts(this.props.charts, this.props.metadata.scenarios)
      this.addMaps(this.props.maps)
    }
  }

  addCharts (charts) {
    _.forEach(charts, (data, name) => {
      const type = data.mark
      const scenarios = data.scenarios
      const placeholder = document.querySelector(`.${data.id}`)
      if (placeholder) {
        if (type === 'stripe' || type === 'line') {
          ReactDOM.render(<ChartLine
            name={name}
            data={data}
            scenarios={scenarios}
            updateChart={this.updateChart}
            dispatch={this.props.dispatch}
            url={this.props}/>, placeholder)
        } else if (data.mark === 'grouped-bar') {
          ReactDOM.render(<ChartGroupedBar
            name={name}
            data={data}
            scenarios={scenarios}
            updateChart={this.updateChart}
            dispatch={this.props.dispatch}/>, placeholder)
        } else {
          ReactDOM.render(<Chart
            name={name}
            data={data}
            scenario={scenarios}
            updateChart={this.updateChart}
            dispatch={this.props.dispatch}
            />, placeholder)
        }
      }
    })
  }

  addMaps (maps) {
    _.forEach(maps, (data, name) => {
      const placeholder = document.querySelector(`.${data.id}`)
      if (placeholder) {
        ReactDOM.render(<MapComponent name={name} data={data} />, placeholder)
      }
    })
  }

  goToTag (tag, e) {
    e.preventDefault()
    this.updateArticleFilters([tag])
    this.props.router.push(`/briefs`)
  }

  updateArticleFilters (filters) {
    this.props.dispatch(updateArticleFilters(filters))
  }

  updateChart (data, id) {
    this.props.dispatch(updateChart(data, id))
  }

  filteredLink (filter, e) {
    e.preventDefault()
    this.props.dispatch(updateArticleFilters([filter]))
    this.props.router.push(`/briefs`)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.metdata && this.props.params.id !== nextProps.params.id) {
      nextProps.dispatch(fetchArticle(nextProps.metadata.url))
    }
  }

  render () {
    if (!this.props.metadata) {
      return <UhOh />
    }

    const { articles, metadata } = this.props
    const { download, locations, scenarios, resources, author, tags } = metadata
    const date = moment(metadata.date, 'M/D/YYYY').format('MMMM Do, YYYY')

    const Locations = locations
    ? <div className='article-metadata__item'>
      <span className='article-metadata__header'>Related Locations:</span>
      <ul>{locations.map(loc => <li key={loc}><a className='link__underline' href="" onClick={this.filteredLink.bind(this, loc)}>{translate(loc)}</a></li>)}</ul>
    </div>
    : ''

    const Scenarios = scenarios
    ? <div className='article-metadata__item'>
      <span className='article-metadata__header'>Related Scenarios:</span>
      <ul>{scenarios.map(s => <li key={s}><Link className='link__underline' to={`/scenarios/${s}-summary`}>{translate(s)}</Link></li>)}</ul>
    </div>
    : ''

    const Resources = resources
    ? <div className='article-metadata__item'>
      <span className='article-metadata__header'>Related Resources:</span>
      <ul>{resources.map(res => <li key={res}><a target="_blank" href={res}>{res}</a></li>)}</ul>
    </div>
    : ''

    const AuthorAndDate = author
    ? <dl className='article-byline header__metadata header__descriptions'>
      <dt className='visually-hidden'>Date</dt>
      <dd>{date}</dd>
      <dt className='visually-hidden'>Author</dt>
      <dd>{metadata.author}</dd>
    </dl>
    : <dl className='article-byline header__metadata header__descriptions'>
      <dt className='visually-hidden'>Date</dt>
      <dd>{date}</dd>
    </dl>

    console.log(download);
    const Download = download
    ? <Link to={download} className='button button--outline button--download'>Download Report</Link>
    : ''

    return (
      <section className='page__article'>
        <section className='header__internal'>
          <div className='row row--shortened'>
            <div className='home__header-split--left split__internal--left'>
              <div className='home__header-split--left__content'>
                <span className='header--type'>{translate(metadata.briefType)}</span>
                <h2 className='header--xxlarge with-metadata'>{metadata.title}</h2>
                <h4 className='header--medium'>{metadata.subtitle}</h4>
                {AuthorAndDate}
              </div>
            </div>
            <div className='home__header-split--right'>
              {Download}
              <Share path={this.props.location.pathname} />
            </div>
          </div>
        </section>
        {this.props.articleLoading
         ? <Loading />
         : <section className='section__internal section__padding'>
             <div className='row row--shortened'>
               <div className='article-metadata'>
                  <div className='article-metadata__item'>
                    <span className='article-metadata__header'>Project:</span>
                    <ul>
                      <li><a className='link__underline' onClick={this.goToTag.bind(this, metadata.project)} href=''>{translate(metadata.project)}</a></li>
                    </ul>
                  </div>
                 {Locations}
                 {Scenarios}
                 {Resources}
               </div>
               <div className='article--content' dangerouslySetInnerHTML={{__html: this.props.article}}>
               </div>
               <div>
                <ul className='article-card__tags link-block'>
                  <span className='article-metadata__header'>Tags:</span>
                  {(tags || []).map(tag => {
                    return <li key={tag}><a className='link__underline' onClick={this.filteredLink.bind(this, tag)} href=''>{translate(tag)}</a></li>
                  })}
                </ul>
              </div>
             </div>
           </section>
        }
        <section className='page__project-articles-list page__articles-list section__padding section--blue'>
          <div className='row row--shortened'>
            <RelatedArticles
              type='brief'
              cardType='project'
              title={`Other Briefs in ${translate(metadata.project)}`}
              articles={findProjectArticles(metadata, articles, metadata.project, 2)}
              router={this.props.router}
              updateArticleFilters={this.updateArticleFilters}
              />
          </div>
        </section>
        <section className='page__related-articles-list page__articles-list section__padding section--blue'>
          <div className='row row--shortened'>
            <RelatedArticles
              type='brief'
              cardType='related'
              articles={findRelatedArticles(metadata, articles, 3)}
              router={this.props.router}
              updateArticleFilters={this.updateArticleFilters}
              />
          </div>
        </section>
        <section className='section__internal section__padding section--grey'>
          <div className='row'>
            <header className='header-internal'>
              <h3 className='header--large with-description'>How to Get More Information</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dui gravida, posuere diam id, congue augue. Pellentesque nec purus ex.</p>
            </header>
            <Link className='button button--main button--small button-group' to={'/about'}>Download Our Data</Link>
            <Link className='button button--main button--small' to={'/about'}>Contact Us</Link>
          </div>
        </section>
      </section>
    )
  }
}

Brief.propTypes = {
  dispatch: React.PropTypes.func,
  articles: React.PropTypes.array,
  fetchArticle: React.PropTypes.func,
  articleLoading: React.PropTypes.bool,
  article: React.PropTypes.string,
  charts: React.PropTypes.object,
  maps: React.PropTypes.object,
  params: React.PropTypes.object,
  router: React.PropTypes.object,
  metadata: React.PropTypes.object,
  location: React.PropTypes.object
}

const mapStateToProps = (state, props) => {
  return {
    metadata: state.article.briefs.find((article) => article.id === props.params.id),
    articles: state.article.briefs,
    articleLoading: state.article.articleLoading,
    article: state.article.article,
    charts: state.article.charts,
    maps: state.article.maps
  }
}
export default connect(mapStateToProps)(Brief)
