import React from 'react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
      }}
    >
      <h1>404 - Not Found</h1>
      <p>
        Sorry, the page you are looking for does
        not exist.
      </p>
      <p>
        You can always go back to the{' '}
        <a href="/">homepage</a>.
      </p>
    </div>
  );
}
