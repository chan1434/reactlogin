import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { supabase } from '../utils/supabase';

export default function SignIn() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    let user, error;

    // Check if the input is an email or a username
    const isEmail = usernameOrEmail.includes('@');
    if (isEmail) {
      ({ user, error } = await supabase.auth.signIn({
        email: usernameOrEmail,
        password,
      }));
    } else {
      // Look up the user's email by their username
      const { data, error: lookupError } = await supabase
        .from('users')
        .select('email')
        .eq('username', usernameOrEmail)
        .single();
      if (lookupError) {
        console.error('Error looking up user email:', lookupError.message);
      } else if (data && data.email) {
        // Use the supabase.auth.signIn method with the looked up email and provided password
        ({ user, error } = await supabase.auth.signIn({
          email: data.email,
          password,
        }));
      } else {
        console.error('No user found with this username:', usernameOrEmail);
      }
    }
    if (error) {
      console.error('Error signing in:', error.message);
    } else {
      console.log('User signed in:', user);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <TextField
          label="Username or Email"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Sign In</Button>
      </form>
      <Link to="/signup">Don't have an account? Sign Up</Link>
    </div>
  );
}
