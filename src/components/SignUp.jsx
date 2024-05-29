import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material';
import { supabase } from '../utils/supabase';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      console.log('User signed up:', user);
      const { data, error: insertError } = await supabase
        .from('users')
        .insert([
          { id: user.id, username },
        ]);
      if (insertError) throw insertError;
      console.log('User profile created:', data);
    } catch (error) {
      console.error('Error:', error.message);
      alert('An error occurred. Please try again later.');
    }
  };
  

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Repeat Password"
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
        />
        <Button type="submit">Sign Up</Button>
      </form>
      <Link to="/signin">Already have an account? Sign In</Link>
    </div>
  );
}
