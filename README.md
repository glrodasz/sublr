
## README Sublr.vercel.app 

  
  
This website is used to track your monthly expenses.https://sublr.vercel.app/

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Learn more](#Learn-more)
- [Firebase Rules](#firebase-rules)
- [Preview](#preview)




## Features

* This website is used to track your monthly expenses
* To put your monthly subscriptions and visualise your expenses in different currencies, in different cards..
 
 If you want to see or want to track your expenses go and login the below website



## Installation

First, run the development server:

```bash
  npm run dev
# or
yarn dev
```
 * Open http://localhost:3000 with your browser to see the result.

 * You can start editing the page by modifying pages/index.js. The page auto-updates as you edit the file.

* API routes can be accessed on http://localhost:3000/api/hello. This endpoint can be edited in pages/api/hello.js

* The pages/api directory is mapped to /api/*. Files in this directory are treated as API routes instead of React pages.


## Learn more

* This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
## Deploy on Vercel

* The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
## Firebase Rules

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
## Preview

You can see the login page given or login using github.
![Log-in-Sublr-Web (1)](https://user-images.githubusercontent.com/107571990/195987207-b9f69fd7-596a-494b-b542-50e1c2fb802c.png)

You can add your expenses and track it.
![Sublr (3)](https://user-images.githubusercontent.com/107571990/195987233-d0712ca4-66a5-4379-986e-d46bf0dbf1b0.png)

You can add your catagories and change and markdown your expenses. 
<img width="1113" alt="sublr 1" src="https://user-images.githubusercontent.com/107571990/195987142-5095d421-f77e-4daf-9530-556458183e15.png">




