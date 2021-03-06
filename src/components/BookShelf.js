import React from 'react';
import PropTypes from 'prop-types';

import Book from './Book';

/**
 * A presentational component that simply displays the name of the category of
 * books to display and the books in that category.
 * @method BookShelf
 * @param  {Object} props - The shelf's header and all the books to showcase.
 */
const BookShelf = props => (
  <div className="bookshelf">
    {/* Header. */}
    <h2 className="bookshelf-title">{props.title}</h2>

    {/* Listed out books. */}
    <div className="bookshelf-books">
      <ol className="books-grid">
        {props.books.map(book => (
          <li key={book.id}>
            <Book
              book={book}
              onBookAction={shelf => props.onBookAction(book, shelf)}
            />
          </li>
        ))}
      </ol>
    </div>
  </div>
);

/**
 * Validation for all the props that this component accepts.
 * @type {Object}
 */
BookShelf.propTypes = {
  /**
   * The header or name of the book shelf.
   * @type {String}
   */
  title: PropTypes.string.isRequired,
  /**
   * All the books in this book shelf.
   * @type {Array}
   */
  books: PropTypes.array.isRequired,
  /**
   * A callback that takes in the shelf a user wants to move a book to which is
   * then taken care of in a parent component.
   * @type {Function}
   */
  onBookAction: PropTypes.func.isRequired,
};

export default BookShelf;
