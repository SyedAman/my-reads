import React from 'react';
import PropTypes from 'prop-types';

import Book from './Book';

/**
 * Simple renders a grid of books.
 * @method BooksGrid
 * @param  {Array} books - The books to display.
 */
const BooksGrid = ({ books, onBookAction }) => {
  console.log(books);

  return (
    <div className="search-books-results">
      <ol className="books-grid">
        {books.length ? (
          books.map(book => (
            <li key={book.id}>
              <Book
                onBookAction={onBookAction}
                coverImageSource={
                  book.imageLinks ? book.imageLinks.thumbnail : ''
                }
                title={book.title}
                author={book.authors ? book.authors[0] : ''}
              />
            </li>
          ))
        ) : (
          <h1>No Results...</h1>
        )}
      </ol>
    </div>
  );
};

BooksGrid.propTypes = {
  /**
   * The books to display in a grid.
   * @type {Array}
   */
  books: PropTypes.array.isRequired,
  /**
   * A callback passed that will perform some form of action given the book
   * the action is taken on and the shelf the user wants to move the book to.
   * @type {Function}
   */
  onBookAction: PropTypes.func.isRequired,
};

export default BooksGrid;
