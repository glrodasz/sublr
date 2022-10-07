This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Local Environment Setup

This project uses Firebase Firestore as database and Auth0 as Auth provider so you have to complete some steps before running the project locally, those are listed below:

1. Create a `.env.local` file into the root and copy the content of `.env.local.example` inside
2. Create a firebase project at the [Firebase Website](https://firebase.google.com), go to project config, click "Add application" and add a web app.
3. Take the credentials provided by firebase to your web app and copy them into `.env.local`
4. In your firebase project config go to "Service accounts" and click "Generate new private key". It will download a json file, change it's name to `serviceAccountKey.json` and paste it in the project's root `/firebase` folder
5. Go to [Auth0 website](https://auth0.com) and create and account if you don't have one or log in
6. Create a web classic project and select Next JS as technology
7. Copy your Auth0 application config from "Settings" and paste it in their respective variables inside the `.env.local` file
8. Follow the Auth0 example to configure the callback URL's 

Now the project is ready to run. Run the project to check everything is working fine and the subscriptions list will now show empty because you won't have any data in your firestore database.

To populate your firestore database you will find a seed script inside of `/scripts/firestoreSeed.js` . That script will create entries in the database with a pre-configured admin id as resource owner. To configure that you could:

1. Add a `console.log` in some view to print the current logged user id
2. Log in with social like gmail or github 
3. Take the printed id and paste it into `ADMIN_USER_ID` inside `.env.local`

After setting an `ADMIN_USER_ID` you can proceed to run the seeder script and check the data has been loaded into the app

## Firebase Rules
NOTE: This rules should be added **only after** the seeder script has ran

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /subscriptions/{sub} {
	  allow read: if request.auth.uid == resource.data.userId
      allow write: if request.auth.uid == request.resource.data.userId
      allow delete: if request.auth.uid == resource.data.userId
    }
  }
}
```