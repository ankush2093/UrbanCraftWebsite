import React, { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container"><div className="text-center mt-5">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}

