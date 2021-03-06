import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

import SearchBar from '../components/SearchBar';
import BooksGrid from '../components/BooksGrid';
import { search } from '../lib/services/booksAPI';

/**
 * A top-level stateful component that serves as the search page of the app.
 * Has a search bar that users can use to look for books to add to their
 * bookshelf. Also displays all the books returned from the search query.
 * @extends Component
 */
class SearchPage extends Component {
  /**
   * Initial state.
   * @type {Object}
   */
  state = {
    /**
     * What the user has typed in the search bar to search for books to add.
     * @type {String}
     */
    searchQuery: '',
    searchResults: [],
    hasQueried: false,
  };

  /**
   * Validation for all props passed down into this component.
   * @type {Object}
   */
  static propTypes = {
    /**
     * A callback passed that will move the book to a specified shelf.
     * @type {Function}
     */
    onBookAction: PropTypes.func.isRequired,
    /**
     * All the books currently in the user's bookshelf in the "My Books" page.
     * @type {Array}
     */
    bookshelf: PropTypes.array.isRequired,
  };

  /**
   * Uses the passed native DOM event from the search bar to update the search
   * query, which will in turn update search results.
   * @method updateSearchQuery
   * @param  {Object} event - Native DOM event.
   * @return {Void}
   */
  updateSearchQuery = async event => {
    // make sure state is updated before HTTP request
    await this.setState({
      searchQuery: event.target.value.trim(),
      hasQueried: false,
    });

    // fetch the books according to the user's query
    await this.getSearchResults();
  };

  /**
   * Fetches the books matching the user's search query. Debounced 1000ms to
   * prevent unneccessary API calls.
   * @method getSearchResults
   * @return {Void)
   */
  getSearchResults = _.debounce(async () => {
    try {
      // prevent unneccessary API calls when user isn't searching anything
      if (!this.state.searchQuery.length) {
        // assume no search results if search input is empty
        await this.setState({
          searchResults: [],
        });
        return;
      }

      // make AJAX call to the API
      let results = await search(this.state.searchQuery, 10);
      // handle cases when API responds with an "empty query" object. Objects
      // shouldn't be stored in searchResults since its type Array
      if (results.constructor !== Array) results = [];

      // update the state to reflect the results
      await this.setState({
        searchResults: results,
      });

      // set corresponding shelf to every book in the search results
      this.setShelf();
    } catch (error) {
      throw new Error(error);
    }
  }, 1000);

  /**
   * Compares the books in the user's bookshelf with the books in the search
   * results and gives each search result book a shelf accordingly. Maintains
   * state for each book and which shelf it belongs in.
   * @method setShelf
   */
  setShelf() {
    // TODO: optimize this loop. Perhaps memoize or use a for loop.
    this.state.searchResults.map(resultBook => {
      // merge searched book with user's books
      const matchedSearchBook = this.props.bookshelf.find(
        bookshelfBook => resultBook.id === bookshelfBook.id,
      );
      if (matchedSearchBook) resultBook.shelf = matchedSearchBook.shelf;

      // assume all other queried books aren't in the user's bookshelf
      if (!resultBook.shelf) {
        resultBook.shelf = 'none';
      }

      return resultBook;
    });

    this.setState({ hasQueried: true });
  }

  render() {
    return (
      <div className="search-books">
        {/* Search bar component which updates search query. */}
        <SearchBar onQuery={this.updateSearchQuery} />

        {/* The search results in accordance to the search query. */}
        {this.state.hasQueried ? (
          <BooksGrid
            books={this.state.searchResults}
            onBookAction={this.props.onBookAction}
          />
        ) : null}
      </div>
    );
  }
}

export default SearchPage;
