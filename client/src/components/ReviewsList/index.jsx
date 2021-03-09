/* eslint-disable react/prop-types */
/* eslint-disable react/sort-comp */
/* eslint-disable no-console */
import React from 'react';
import axios from 'axios';
import ReviewsAverageOverviewStars from '../ReviewsAverageOverviewStars';
import ReviewRatingDistribution from '../ReviewRatingDistribution';
import ReviewCharacteristics from '../ReviewCharacteristics';
import ReviewTiles from '../ReviewTiles';
import ReviewAddFormModal from '../ReviewAddFormModal';
import ReviewsMoreReviews from '../ReviewsMoreReviews';
import styles from './ReviewsList.css';
// import ReviewsAddForm from '../ReviewsAddForm';
// import exampleReviewsData from '../../../../data/reviews';

class ReviewsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewsList: [],
      limitedReviewsList: [],
      displayModal: false,
      displayMoreButton: true,
      numberOfReviewsDisplayed: 2,
      currentPage: 1,
    };
    this.getReviews = this.getReviews.bind(this);
    this.addReview = this.addReview.bind(this);
    this.openAddReviewModal = this.openAddReviewModal.bind(this);
    this.closeAddReviewModal = this.closeAddReviewModal.bind(this);
    this.getMoreReviews = this.getMoreReviews.bind(this);
  }

  componentDidMount() {
    this.getReviews();
  }

  // Send current product id from App with get request and retrieve reviews list
  getReviews() {
    // const { currentProduct } = this.props;
    const currentProduct = '14296'; // 14931, 14932, 14034, 14296, 14807
    const {
      currentPage,
    } = this.state;
    axios.get('/reviews', {
      params: {
        productId: currentProduct,
        page: currentPage,
      },
    })
      .then((response) => {
        const reviewsData = response.data.results;
        this.setState({
          reviewsList: reviewsData,
          limitedReviewsList: [reviewsData[0], reviewsData[1]],
        });
      })
      .catch((error) => {
        console.log('Error fetching reviews: ', error);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  addReview(formData) {
    // const { currentProduct } = this.props;
    const currentProduct = '14296'; // 14931, 14932, 14034, 14296, 14807
    const reviewDataObject = {
      product_id: currentProduct,
      rating: formData.overallRating,
      summary: formData.reviewSummary || '',
      body: formData.reviewBody,
      recommend: formData.recommended,
      name: formData.reviewUsername,
      email: formData.email,
      photos: formData.uploadedFile || '',
      characteristics: {
        sizeID: formData.size,
        widthID: formData.width,
        comfortID: formData.comfort,
        qualityID: formData.quality,
        productLengthID: formData.productLength,
        fitID: formData.fit,
      },
    };
    axios.post('/reviews', reviewDataObject)
      .then((response) => {
        alert('Successfully added review');
        this.getReviews();
      })
      .catch((error) => {
        console.log('Error adding review: ', error);
      });
  }

  // eslint-disable-next-line class-methods-use-this
  openAddReviewModal() {
    this.setState({ displayModal: true });
  }

  closeAddReviewModal() {
    this.setState({ displayModal: false });
  }

  // eslint-disable-next-line class-methods-use-this
  // Display two more reviews
  getMoreReviews() {
    const {
      reviewsList,
      limitedReviewsList,
      numberOfReviewsDisplayed,
    } = this.state;
    const { totalNumberOfStars } = this.props;
    const currentLength = limitedReviewsList.length;
    if (reviewsList[numberOfReviewsDisplayed + 2]) {
      this.setState({
        limitedReviewsList: [
          ...limitedReviewsList,
          reviewsList[currentLength + 1],
          reviewsList[currentLength + 2],
        ],
        numberOfReviewsDisplayed: (numberOfReviewsDisplayed + 2),
      });
    } else if (reviewsList[currentLength + 1]) {
      this.setState({
        limitedReviewsList: [...limitedReviewsList, reviewsList[currentLength + 1]],
        numberOfReviewsDisplayed: (numberOfReviewsDisplayed + 1),
      });
    } else {
      this.setState({ displayMoreButton: false });
    }
    if (numberOfReviewsDisplayed === totalNumberOfStars) {
      this.setState({ displayMoreButton: false });
    }
  }

  render() {
    const {
      metaObject,
      recommendPercent,
      totalNumberOfStars,
      starRating,
      fiveStarTotal,
      fourStarTotal,
      threeStarTotal,
      twoStarTotal,
      oneStarTotal,
    } = this.props;

    const {
      displayModal,
      displayMoreButton,
      limitedReviewsList,
    } = this.state;

    let ReviewModalRender;
    if (displayModal === true) {
      ReviewModalRender = (
        <ReviewAddFormModal
          className={styles.modalBackdrop}
          addReview={this.addReview}
          displayModal={displayModal}
          closeAddReviewModal={this.closeAddReviewModal}
        />
      );
    } else {
      ReviewModalRender = null;
    }

    return (
      <div className={styles.reviewsList}>
        <div>
          <div className={styles.ratingsOverview}>
            <h3 className={styles.ratingsAndReviewsTitle}>Reviews and Ratings</h3>
            <div className={styles.overallRating}>{starRating}</div>
            <div className={styles.starRating}>
              <ReviewsAverageOverviewStars starRating={starRating} />
            </div>
            <div className={styles.recommendOverview}>
              <div className={styles.recommendedPercent}>
                {recommendPercent}
                %
              </div>
              {' '}
              of reviewers recommend this product
            </div>
            <ReviewRatingDistribution
              className={styles.ratingDistribution}
              reviewCount={totalNumberOfStars}
              fiveStarTotal={Number(fiveStarTotal)}
              fourStarTotal={Number(fourStarTotal)}
              threeStarTotal={Number(threeStarTotal)}
              twoStarTotal={Number(twoStarTotal)}
              oneStarTotal={Number(oneStarTotal)}
            />
            <div className={styles.reviewTotal}>
              {totalNumberOfStars}
              {' '}
              Total Reviews
            </div>
            <ReviewCharacteristics metaObject={metaObject} />
          </div>
        </div>
        <div>
          <div>
            {
              limitedReviewsList.map((review) => (
                <ReviewTiles review={review} key={review.review_id} />
              ))
            }
          </div>
          {ReviewModalRender}
          <ReviewsMoreReviews
            openAddReviewModal={this.openAddReviewModal}
            getMoreReviews={this.getMoreReviews}
            displayMoreButton={displayMoreButton}
          />
        </div>
      </div>
    );
  }
}

export default ReviewsList;

// Slightly unclear regarding characteristics post request instructions in Learn
// How do we get ID?

// characteristics: {
//   size: {
//     value: formData.size,
//   },
//   width: {
//     value: formData.width,
//   },
//   comfort: {
//     value: formData.comfort,
//   },
//   quality: {
//     value: formData.quality,
//   },
//   productLength: {
//     value: formData.productLength,
//   },
//   fit: {
//     value: formData.fit,
//   },
// },