import React, { useState, useEffect } from 'react';

export default function ControlSearch({ searchText, onChangeSearch }) {
  const [text, setText] = useState('');

  useEffect(() => {
    setText(searchText);
  }, [searchText])

  function handleChangeSearchText(e) {
    setText(e.target.value);
    onChangeSearch && typeof onChangeSearch === 'function' &&
      onChangeSearch(e.target.value);
  }
  function handleClear() {
    onChangeSearch && typeof onChangeSearch === 'function' &&
      onChangeSearch('');
  }
  return (
    <div className="col-12">
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={handleChangeSearchText}
          className="form-control"
          placeholder="Search for..."
        />
        <span className="input-group-append">
          <button onClick={handleClear} className="btn btn-info" type="button">Clear!</button>
        </span>
      </div>
    </div>
  )
}