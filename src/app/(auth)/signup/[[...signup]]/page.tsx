// 'use client';
import { SignUp } from '@clerk/nextjs';
// import * as Clerk from '@clerk/elements/common';
// import * as SignUp from '@clerk/elements/sign-up';
import { redirect } from 'next/navigation';

import { serverFeatureFlags } from '@/config/featureFlags';
import { metadataModule } from '@/server/metadata';
import { translation } from '@/server/translation';

export const generateMetadata = async () => {
  const { t } = await translation('clerk');
  return metadataModule.generate({
    description: t('signUp.start.subtitle'),
    title: t('signUp.start.title'),
    url: '/signup',
  });
};

const Page = () => {
  const enableClerkSignUp = serverFeatureFlags().enableClerkSignUp;

  if (!enableClerkSignUp) {
    redirect('/login');
  }

  return <SignUp fallbackRedirectUrl="/health" />;
  // return (
  //   <SignUp.Root>
  //     <SignUp.Step name="start">
  //       <h1>Create an account</h1>

  //       <Clerk.Connection name="google">Sign up with Google</Clerk.Connection>

  //       <Clerk.Field name="username">
  //         <Clerk.Label>Username</Clerk.Label>
  //         <Clerk.Input />
  //         <Clerk.FieldError />
  //       </Clerk.Field>

  //       <Clerk.Field name="emailAddress">
  //         <Clerk.Label>Email</Clerk.Label>
  //         <Clerk.Input />
  //         <Clerk.FieldError />
  //       </Clerk.Field>

  //       <Clerk.Field name="password">
  //         <Clerk.Label>Password</Clerk.Label>
  //         <Clerk.Input />
  //         <Clerk.FieldError />
  //       </Clerk.Field>
  //       <Clerk.Field name="age">
  //         <Clerk.Label>Age</Clerk.Label>
  //         <Clerk.Input required type="number" />
  //         <Clerk.FieldError />
  //       </Clerk.Field>
  //       <Clerk.Field name="gender">
  //         <Clerk.Label>Gender</Clerk.Label>
  //         <select name="gender" required>
  //           <option value="">Select your gender</option>
  //           <option value="male">Male</option>
  //           <option value="female">Female</option>
  //           <option value="other">Other</option>
  //         </select>
  //         <Clerk.FieldError />
  //       </Clerk.Field>
  //       <Clerk.Field name="height">
  //         <Clerk.Label>Height (cm)</Clerk.Label>
  //         <Clerk.Input required type="number" />
  //         <Clerk.FieldError />
  //       </Clerk.Field>

  //       <Clerk.Field name="weight">
  //         <Clerk.Label>Weight (kg)</Clerk.Label>
  //         <Clerk.Input required type="number" />

  //         <Clerk.FieldError />
  //       </Clerk.Field>

  //       <SignUp.Action submit>Sign up</SignUp.Action>
  //     </SignUp.Step>

  //     {/* <SignUp.Step name="continue">
  //       <h1>Fill in the following fields</h1> */}

  //     {/* <Clerk.Field name="age">
  //         <Clerk.Label>Age</Clerk.Label>
  //         <Clerk.Input />
  //         <Clerk.FieldError />
  //       </Clerk.Field> */}
  //     {/* <Clerk.Field name="height">
  //         <Clerk.Label>Height</Clerk.Label>
  //         <Clerk.Input />
  //         <Clerk.FieldError />
  //       </Clerk.Field>
  //       <Clerk.Field name="weight">
  //         <Clerk.Label>Weight</Clerk.Label>
  //         <Clerk.Input />
  //         <Clerk.FieldError />
  //       </Clerk.Field> */}
  //     {/*
  //       <SignUp.Action submit>Continue</SignUp.Action>
  //     </SignUp.Step> */}

  //     {/* <SignUp.Step name="verifications">
  //       <SignUp.Strategy name="phone_code">
  //         <h1>Check your phone for an SMS</h1>

  //         <Clerk.Field name="code">
  //           <Clerk.Label>Phone Code</Clerk.Label>
  //           <Clerk.Input />
  //           <Clerk.FieldError />
  //         </Clerk.Field>

  //         <SignUp.Action submit>Verify</SignUp.Action>
  //       </SignUp.Strategy>

  //       <SignUp.Strategy name="email_code">
  //         <h1>Check your email</h1>

  //         <Clerk.Field name="code">
  //           <Clerk.Label>Email Code</Clerk.Label>
  //           <Clerk.Input />
  //           <Clerk.FieldError />
  //         </Clerk.Field>

  //         <SignUp.Action submit>Verify</SignUp.Action>
  //       </SignUp.Strategy>
  //     </SignUp.Step> */}
  //   </SignUp.Root>
  // );
};

Page.displayName = 'SignUp';

export default Page;
