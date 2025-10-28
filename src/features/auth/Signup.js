import React from 'react';

export default function Signup() {
  return (
    <div className="signup-page" style={{padding: '4rem', textAlign: 'center'}}>
      <h1 className="text-3xl font-bold mb-4">Join WellnessCafe</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create your account to connect with certified facilitators and access personalized recovery tools.
      </p>
      <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
        Get Started
      </button>
    </div>
  );
}
