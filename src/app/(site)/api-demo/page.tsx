'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export default function ApiDemo() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/hello');
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error fetching message');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">API Demo</h1>
      <Button onClick={fetchMessage} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Message'}
      </Button>
      {message && <p className="text-lg">{message}</p>}
    </div>
  );
} 