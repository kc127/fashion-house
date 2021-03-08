import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

import RelatedProducts from '../RelatedProducts';
import QuestionsAndAnswers from '../QuestionsAndAnswers';
import Overview from '../Overview';
import ReviewsList from '../ReviewsList';
import styles from './App.css';

class AppComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product: undefined,
      starRating: 0,
      metaObject: {},
    };
    this.getMetaData = this.getMetaData.bind(this);
    this.getAverageRating = this.getAverageRating.bind(this);
  }

  componentDidMount() {
    this.fetchProductDetail();
    this.getMetaData();
  }

  componentDidUpdate(prev) {
    const { match } = this.props;
    const { productId } = match.params;
    const { productId: prevId } = prev.match.params;

    if (productId !== prevId) {
      this.fetchProductDetail();
    }
  }

  fetchProductDetail() {
    const { match } = this.props;
    const { productId } = match.params;
    if (productId) {
      axios.get(`/api/products/${productId}`)
        .then((response) => {
          this.setState({
            product: response.data,
          });
        });
    }
  }

  getMetaData() {
    axios.get('/reviews/meta')
      .then((response) => {
        this.setState({ metaObject: response.data });
        this.getAverageRating();
      })
      .catch((error) => {
        console.log('Error fetching meta data: ', error);
      })
  }

  getAverageRating() {
    const { metaObject } = this.state;
    const metaRatings = metaObject.ratings;
    let oneStar = 0;
    let twoStar = 0;
    let threeStar = 0;
    let fourStar = 0;
    let fiveStar = 0;
    let starSubtotal = 0;
    let starTotal = 0;
    if (metaRatings) {
      for (key in metaRatings) {
        starSubtotal += (key * obj[key]);
        starTotal += (key * obj[key]);
      }

      console.log('STAR SUBTOTAL: ', starSubtotal);
      console.log('STAR RATING: ', this.state.starRating);
      console.log('STARS TOTAL: ', starTotal);
    }
    this.setState({ starRating: ((ratingsTotal / totalStars).toFixed(1) * 100) });
  }

  render() {
    const { match } = this.props;
    const { product, starRating } = this.state;

    return (
      <>
        <Overview startRating={starRating} />
        <RelatedProducts productId={match.params.productId} product={product} />
        <ReviewsList />
        <QuestionsAndAnswers />
      </>
    );
  }
}

AppComponent.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      productId: PropTypes.string,
    }),
  }).isRequired,
};

const App = () => (
  <Router>
    <div className={styles.app}>
      <nav className={styles.nav}>
        <h1 className={styles.brandName}>Oscillating Owls</h1>
        <form name="appSearch" className={styles.searchForm}>
          <input type="search" className={styles.searchInput} />
        </form>
      </nav>
      <h3 className={styles.announcement}>
        <span className={styles.announcementAlert}>site-wide accouncement message!</span>
        <span> — sale / discount </span>
        <span className={styles.announcementOffer}>offer</span>
        <span> — </span>
        <span className={styles.announcementHighlight}>new product highlight</span>
      </h3>

      <Switch>
        <Route path="/products/:productId" component={AppComponent} />
        <Route path="*" render={() => (<div>No Route</div>)} />
      </Switch>
    </div>
  </Router>
);

export default App;
