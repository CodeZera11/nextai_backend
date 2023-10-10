# NEXTAI_ASSIGNMENT BACKEND

## Local Setup

To run this project locally, follow these steps:

1. Fork and clone the repository.
2. Run `npm install` to install the `node_modules` folder.
3. Create a new file called `.env` in the project directory. Open the `.env.example` file and copy all the environment variable names listed inside.
4. Now, Generate the required client ID, secret, and API key from the Google Cloud Console. Here are the steps to do that:
   - Go to the Google Cloud Console (🔍 search for "Google Cloud Console" in your favorite search engine).
   - Create a new project by navigating to the project selection dropdown and clicking on "New Project". Give it a suitable name.
   - Once your project is created, select it from the project selection dropdown.
   - In the sidebar, click on "APIs & Services" and then "Credentials".
   - Click on the "Create Credentials" button and choose "OAuth client ID" from the dropdown menu.
   - Select the application type based on your project's requirements. Fill in the necessary details, such as authorized JavaScript origins and redirect URIs.
   - After providing the required information, click on the "Create" button.
   - On the next screen, you will see the generated client ID and secret. Copy these values.
   - Go back to your project's .env file and paste the client ID and secret into the respective variables.
   - Also generate the API Key and give permission to Calendar API.
5. Run the code using `npm run dev`.

That's it! You should now be able to run the project locally.
