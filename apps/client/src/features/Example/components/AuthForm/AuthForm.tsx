"use client";

import { apiClient } from "@/src/shared/lib/apiClient";
import { signIn, signOut } from "@app/server/react";
import { useEffect, useState } from "react";
import { signUpAction } from "../../server/signUpAction";

export const AuthForm = () => {
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    const { name, email, password } = signUpForm;
    const result = await signUpAction({ name, email, password });
    console.log("handleSignUp result", result);
  };

  const handleSignIn = async () => {
    const result = await signIn("credentials", {
      email: signInForm.email,
      password: signInForm.password,
    });
    console.log("handleSignIn result", result);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  useEffect(() => {
    apiClient.api.examples.$get().then((data) => {
      console.log("data", data);
    });
  }, []);

  return (
    <div>
      <h1>SignIn Form</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignIn();
        }}
      >
        <input
          type="email"
          value={signInForm.email}
          onChange={(e) =>
            setSignInForm({ ...signInForm, email: e.target.value })
          }
        />
        <input
          type="password"
          value={signInForm.password}
          onChange={(e) =>
            setSignInForm({ ...signInForm, password: e.target.value })
          }
        />
        <button type="submit">Submit</button>
      </form>
      <h1>SignUp Form</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignUp();
        }}
      >
        <input
          type="text"
          value={signUpForm.name}
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, name: e.target.value })
          }
        />
        <input
          type="email"
          value={signUpForm.email}
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, email: e.target.value })
          }
        />
        <input
          type="password"
          value={signUpForm.password}
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, password: e.target.value })
          }
        />
        <button type="submit">Submit</button>
      </form>
      <h1>SignOut</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignOut();
        }}
      >
        <button type="submit">SignOut</button>
      </form>
    </div>
  );
};
