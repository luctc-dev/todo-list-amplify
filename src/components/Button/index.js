import './button.css';
import React from 'react';

import Loading from './Loading';

export default function Button({ children, loading, ...restProps }) {

  return (
    <button {...restProps}>
      {loading && <Loading color="#fff" />}
      <span>{children}</span>
    </button>
  )
}